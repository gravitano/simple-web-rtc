import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 3001;
const wss = new WebSocketServer({ port: PORT });
const rooms = {};

console.log(`🚀 WebSocket server is running on port ${PORT}`);
console.log(`📡 Ready to accept connections...`);

wss.on('connection', (ws) => {
  console.log('✅ New client connected');

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    const { type, room, payload } = data;

    if (type === 'join') {
      rooms[room] = rooms[room] || [];
      rooms[room].push(ws);
      ws.room = room;
      console.log(`👤 User joined room: ${room} (${rooms[room].length} users in room)`);
    }

    if (type === 'signal') {
      rooms[ws.room]?.forEach((client) => {
        if (client !== ws) client.send(JSON.stringify({ type: 'signal', payload }));
      });
    }
  });

  ws.on('close', () => {
    if (ws.room) {
      rooms[ws.room] = rooms[ws.room]?.filter((c) => c !== ws);
      console.log(`👋 User left room: ${ws.room} (${rooms[ws.room]?.length || 0} users remaining)`);
    }
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});
