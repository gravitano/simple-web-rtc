import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });
const rooms = {};

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    const { type, room, payload } = data;

    if (type === 'join') {
      rooms[room] = rooms[room] || [];
      rooms[room].push(ws);
      ws.room = room;
      console.log(`user joined room: ${room}`);
    }

    if (type === 'signal') {
      rooms[ws.room]?.forEach((client) => {
        if (client !== ws) client.send(JSON.stringify({ type: 'signal', payload }));
      });
    }
  });

  ws.on('close', () => {
    rooms[ws.room] = rooms[ws.room]?.filter((c) => c !== ws);
  });
});
