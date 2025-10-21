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
npm install
# or if you prefer pnpm:
# pnpm install
```

> **Note:** Project ini compatible dengan npm, pnpm, atau yarn. Railway dan Render akan auto-detect dan menggunakan npm secara default.

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

## Deployment

> 📘 **Untuk panduan deployment lengkap dalam Bahasa Indonesia, lihat [DEPLOYMENT.md](./DEPLOYMENT.md)**

### ⚠️ Important: Vercel Limitations

**Vercel does NOT support WebSocket servers** due to its serverless architecture. The backend WebSocket server cannot run on Vercel as it requires persistent connections.

### Recommended Deployment Strategy

Deploy the **frontend** and **backend** separately:

#### Option 1: Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**

1. Create `vercel.json` in the root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/frontend/index.html" }
  ]
}
```

2. Update `frontend/index.html` to use production WebSocket URL:
```javascript
const ws = new WebSocket('wss://your-backend.railway.app');
```

3. Deploy to Vercel:
```bash
vercel --prod
```

**Backend on Railway:**

> 📘 **Panduan lengkap Railway + troubleshooting: [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)**

1. Create a Railway account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "Deploy Now" and let Railway auto-detect everything
5. **Important:** Do NOT set Root Directory - leave it default/empty
6. Railway will auto-detect and run `npm start` from root package.json
7. Go to Settings → Networking → Click "Generate Domain"
8. Copy the generated WebSocket URL (e.g., `wss://your-app.up.railway.app`)

**Backend on Render:**

1. Create a Render account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pnpm install`
   - **Start Command**: `node server.js`
5. Deploy and note your WebSocket URL

#### Option 2: Fully on Railway/Render

Deploy both frontend and backend on the same platform:

**Railway:**
- Create two services in one project
- Frontend: Static site serving `frontend/index.html`
- Backend: Node.js service for WebSocket server

**Render:**
- Deploy backend as a Web Service
- Deploy frontend as a Static Site

#### Option 3: Vercel Serverless Alternative (Advanced)

Use Vercel with a serverless WebSocket alternative like:
- **Pusher**: Managed WebSocket service
- **Ably**: Real-time messaging platform
- **Socket.io with Vercel**: Using serverless adapters

Example with Pusher:

```javascript
// Install: npm install pusher-js pusher
import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// In Vercel serverless function
export default async function handler(req, res) {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
  });
  
  await pusher.trigger('room', 'signal', req.body);
  res.status(200).json({ success: true });
}
```

### Production Checklist

Before deploying to production:

- [ ] Use WSS (WebSocket Secure) instead of WS
- [ ] Use HTTPS for frontend
- [ ] Add CORS configuration
- [ ] Implement rate limiting
- [ ] Add authentication
- [ ] Use environment variables for URLs
- [ ] Add error handling and logging
- [ ] Monitor server health
- [ ] Set up TURN server for better NAT traversal
- [ ] Add reconnection logic

### Environment Variables

Create `.env` file for local development:

```bash
# Backend
PORT=3001
FRONTEND_URL=http://localhost:8080

# Frontend (if using build tool)
VITE_WS_URL=ws://localhost:3001
```

For production:
```bash
# Backend
PORT=443
FRONTEND_URL=https://your-app.vercel.app

# Frontend
VITE_WS_URL=wss://your-backend.railway.app
```

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
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Pusher Channels](https://pusher.com/channels)

