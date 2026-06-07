import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001, host: '0.0.0.0' });

console.log("WebSocket server is running on ws://0.0.0.0:3001");

wss.on('connection', function connection(ws) {
  console.log("New client connected!");
  
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    // Broadcast the message to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === 1) { // 1 is WebSocket.OPEN
        client.send(data.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log("Client disconnected.");
  });
});
