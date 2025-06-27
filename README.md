# WatchParty 🎬

A modern web application that allows users to watch videos together synchronously while engaging in real-time group chat. This app replicates the experience of watching content with friends in the same room, fostering interaction and shared enjoyment despite physical distance.

## Features

### 🎥 Video Player

- **Synchronized Playback**: All participants see the video at the exact same point
- **Interactive Controls**: Play/pause, seek bar, volume control
- **Fullscreen Support**: Immersive viewing experience
- **Cast Support**: Cast to larger screens (Chromecast, AirPlay)

### 💬 Real-time Chat

- **Live Messaging**: Instant message delivery
- **User Avatars**: Visual identification of participants
- **Message Timestamps**: Track conversation flow
- **Emoji Support**: Rich expression capabilities
- **Participant Counter**: See who's in the party

### 👥 Social Features

- **Party Creation**: Create new watch parties
- **Invite System**: Share unique links to join parties
- **Participant Management**: See active users
- **Role Management**: Host controls and permissions

## UI Design

The application features a modern, dark-themed interface with:

- **Responsive Layout**: Works on desktop and mobile devices
- **Glass Morphism**: Modern blur effects and transparency
- **Smooth Animations**: Hover effects and transitions
- **Intuitive Navigation**: Easy-to-use controls and buttons

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Styled Components
- **Icons**: React Icons
- **Video**: YouTube IFrame Player API (planned)
- **Real-time**: WebSocket integration (planned)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AlperDog/watch-party.git
cd watch-party
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── WatchParty.tsx      # Main application component
│   ├── VideoPlayer.tsx     # Video player with controls
│   └── ChatArea.tsx        # Real-time chat interface
├── App.tsx                 # Root application component
├── index.tsx              # Application entry point
└── index.css              # Global styles
```

## Current Status

This is the initial UI implementation with:

- ✅ Complete UI mockup implementation
- ✅ Responsive design
- ✅ Interactive components
- ✅ Modern styling with glass morphism effects
- 🔄 Backend integration (planned)
- 🔄 Real-time synchronization (planned)
- 🔄 YouTube API integration (planned)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for social video watching during remote work
- Built with modern web technologies for the best user experience
- Designed with accessibility and usability in mind
