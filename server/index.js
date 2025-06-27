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
          videoState: null,
          chatHistory: [],
        };
      }
      rooms[currentRoom].clients.add(ws);
      // Send chat history and video state
      ws.send(
        JSON.stringify({
          type: "init",
          chatHistory: rooms[currentRoom].chatHistory,
          videoState: rooms[currentRoom].videoState,
        })
      );
      // Notify others
      broadcast(currentRoom, {
        type: "user-joined",
        username,
        participants: rooms[currentRoom].clients.size,
      });
    } else if (msg.type === "video") {
      // { type: 'video', action, payload }
      if (currentRoom) {
        rooms[currentRoom].videoState = msg;
        broadcast(currentRoom, { ...msg, username });
      }
    } else if (msg.type === "chat") {
      // { type: 'chat', message, timestamp }
      if (currentRoom) {
        const chatMsg = {
          type: "chat",
          message: msg.message,
          username,
          timestamp: msg.timestamp,
        };
        rooms[currentRoom].chatHistory.push(chatMsg);
        broadcast(currentRoom, chatMsg);
      }
    }
  });

  ws.on("close", () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom].clients.delete(ws);
      broadcast(currentRoom, {
        type: "user-left",
        username,
        participants: rooms[currentRoom].clients.size,
      });
      if (rooms[currentRoom].clients.size === 0) {
        delete rooms[currentRoom];
      }
    }
  });
});

function broadcast(roomId, msg) {
  if (!rooms[roomId]) return;
  for (const client of rooms[roomId].clients) {
    if (client.readyState === 1) {
      client.send(JSON.stringify(msg));
    }
  }
}

app.get("/", (req, res) => {
  res.send("WatchParty WebSocket server is running.");
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
