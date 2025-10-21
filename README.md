# WebRTC Video Chat POC

A simple proof-of-concept implementation of peer-to-peer video chat using WebRTC and WebSocket signaling.

## Overview

This project demonstrates a minimal implementation of WebRTC for real-time video communication between browsers. It uses a WebSocket server for signaling and establishes peer-to-peer connections for media streaming.

## Features

- 🎥 Real-time video and audio streaming
- 🔄 Peer-to-peer connection using WebRTC
- 🏠 Room-based chat system
- 📡 WebSocket signaling server
- 🚀 Minimal setup with no authentication

## Project Structure

```
poc-web-rtc/
├── backend/
│   ├── server.js          # WebSocket signaling server
│   ├── package.json       # Backend dependencies
│   └── pnpm-lock.yaml
├── frontend/
│   └── index.html         # Simple video chat interface
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- pnpm (or npm/yarn)
- A modern web browser with WebRTC support
- Camera and microphone permissions

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd poc-web-rtc
```

2. Install backend dependencies:
```bash
cd backend
pnpm install
```

## Usage

### Starting the Signaling Server

1. Navigate to the backend directory:
```bash
cd backend
```

2. Start the WebSocket server:
```bash
node server.js
```

The server will start on `ws://localhost:3001`

### Running the Client

1. Open `frontend/index.html` in your web browser
2. Allow camera and microphone permissions when prompted
3. Open the same file in another browser tab or window (or on another device on the same network)
4. Both clients will automatically connect to the `demo` room and establish a peer connection

## How It Works

### Architecture

```
┌─────────┐                  ┌──────────────┐                  ┌─────────┐
│ Client A│◄────WebSocket────►│   Signaling  │◄────WebSocket────►│ Client B│
│         │                   │    Server    │                   │         │
└─────────┘                   └──────────────┘                   └─────────┘
     │                                                                 │
     │                                                                 │
     └─────────────────WebRTC P2P Connection──────────────────────────┘
                          (Audio/Video Stream)
```

### Components

#### Backend (Signaling Server)
- Uses WebSocket (`ws` library) for real-time communication
- Manages room-based connections
- Relays WebRTC signaling messages (SDP offers/answers and ICE candidates) between peers
- Does not handle media streams (those go directly peer-to-peer)

#### Frontend (Client)
- Creates `RTCPeerConnection` for WebRTC
- Captures local media (video/audio) using `getUserMedia`
- Exchanges SDP (Session Description Protocol) and ICE candidates via WebSocket
- Establishes direct peer-to-peer connection for media streaming
- Uses Google's public STUN server for NAT traversal

### Signaling Flow

1. **Join Room**: Client connects to WebSocket and joins a room
2. **Offer Creation**: First client creates an SDP offer
3. **Offer Exchange**: Offer is sent via WebSocket to other peers
4. **Answer Creation**: Second client receives offer and creates answer
5. **ICE Candidate Exchange**: Both peers exchange ICE candidates
6. **Connection Established**: Peer-to-peer connection is established
7. **Media Streaming**: Audio/video streams directly between peers

## Limitations

- Only supports 2 peers per room (simple mesh topology)
- No authentication or security
- No fallback to TURN server (may not work behind restrictive NATs)
- No error handling or reconnection logic
- Hard-coded room name (`demo`)
- Very basic UI with no controls

## Potential Improvements

- [ ] Add support for multiple peers (mesh or SFU architecture)
- [ ] Implement TURN server for better NAT traversal
- [ ] Add room management UI (create/join rooms)
- [ ] Add user authentication
- [ ] Implement screen sharing
- [ ] Add chat messaging
- [ ] Add mute/unmute controls
- [ ] Show connection status and quality indicators
- [ ] Add error handling and automatic reconnection
- [ ] Deploy to production with HTTPS/WSS

## Technologies Used

- **WebRTC**: Real-time peer-to-peer communication
- **WebSocket**: Signaling channel for connection establishment
- **Node.js**: Backend runtime
- **ws**: WebSocket library for Node.js

## Browser Compatibility

Works on modern browsers that support WebRTC:
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## License

MIT

## Resources

- [WebRTC API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [WebRTC Samples](https://webrtc.github.io/samples/)
- [STUN/TURN Servers](https://www.metered.ca/tools/openrelay/)

