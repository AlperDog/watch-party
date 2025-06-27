import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 4000;

// In-memory rooms: { [roomId]: { clients: Set<WebSocket>, videoState, chatHistory } }
const rooms = {};

wss.on("connection", (ws) => {
  let currentRoom = null;
  let username = null;

  ws.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch {
      return;
    }
    if (msg.type === "join") {
      // { type: 'join', roomId, username }
      currentRoom = msg.roomId;
      username = msg.username;
      if (!rooms[currentRoom]) {
        rooms[currentRoom] = {
          clients: new Set(),
          videoState: {
            videoId: "",
            isPlaying: false,
            currentTime: 0,
            volume: 50,
          },
          chatHistory: [],
        };
      }
      rooms[currentRoom].clients.add(ws);
      // Send initial data to the new client
      ws.send(
        JSON.stringify({
          type: "init",
          chatHistory: rooms[currentRoom].chatHistory,
          videoState: rooms[currentRoom].videoState,
          participants: rooms[currentRoom].clients.size,
        })
      );
      // Notify other clients about the new user
      broadcastToRoom(
        currentRoom,
        {
          type: "user-joined",
          username,
          participants: rooms[currentRoom].clients.size,
        },
        ws
      );
    } else if (msg.type === "chat") {
      // { type: 'chat', message }
      if (currentRoom && username) {
        const chatMessage = {
          username,
          message: msg.message,
          timestamp: msg.timestamp || new Date().toISOString(),
        };
        rooms[currentRoom].chatHistory.push(chatMessage);
        // Keep only last 100 messages
        if (rooms[currentRoom].chatHistory.length > 100) {
          rooms[currentRoom].chatHistory =
            rooms[currentRoom].chatHistory.slice(-100);
        }
        broadcastToRoom(currentRoom, {
          type: "chat",
          ...chatMessage,
        });
      }
    } else if (msg.type === "video") {
      // { type: 'video', action, payload }
      if (currentRoom && username) {
        const videoMessage = {
          type: "video",
          action: msg.action,
          payload: msg.payload,
          username,
          timestamp: new Date().toISOString(),
        };
        // Update room's video state based on action
        if (msg.action === "changeVideo") {
          rooms[currentRoom].videoState.videoId = msg.payload.videoId;
        } else if (msg.action === "play") {
          rooms[currentRoom].videoState.isPlaying = true;
          rooms[currentRoom].videoState.currentTime = msg.payload.currentTime;
        } else if (msg.action === "pause") {
          rooms[currentRoom].videoState.isPlaying = false;
          rooms[currentRoom].videoState.currentTime = msg.payload.currentTime;
        } else if (msg.action === "seek") {
          rooms[currentRoom].videoState.currentTime = msg.payload.time;
        } else if (msg.action === "volume") {
          rooms[currentRoom].videoState.volume = msg.payload.volume;
        }
        broadcastToRoom(currentRoom, videoMessage);
      }
    }
  });

  ws.on("close", () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom].clients.delete(ws);
      if (rooms[currentRoom].clients.size === 0) {
        // Delete room if empty
        delete rooms[currentRoom];
      } else {
        // Notify remaining clients
        broadcastToRoom(currentRoom, {
          type: "user-left",
          username,
          participants: rooms[currentRoom].clients.size,
        });
      }
    }
  });
});

function broadcastToRoom(roomId, message, excludeWs = null) {
  if (rooms[roomId]) {
    rooms[roomId].clients.forEach((client) => {
      if (client !== excludeWs && client.readyState === 1) {
        // 1 = WebSocket.OPEN
        client.send(JSON.stringify(message));
      }
    });
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    rooms: Object.keys(rooms).length,
    totalClients: Object.values(rooms).reduce(
      (sum, room) => sum + room.clients.size,
      0
    ),
  });
});

server.listen(PORT, () => {
  console.log(`WatchParty WebSocket server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
