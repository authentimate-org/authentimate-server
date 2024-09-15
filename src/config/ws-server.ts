// import { Server } from 'http';
// import WebSocket from 'ws';

// const server = new Server();

// const wsServer = new WebSocket.Server({ server });

// wsServer.on('connection', (ws) => {
//   console.log('New client connected');

//   ws.on('message', (message) => {
//     console.log('received: %s', message);
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// const broadcast = (data: any) => {
//   wsServer.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(data));
//     }
//   });
// };

// const WS_SERVER_PORT = process.env.WS_SERVER_PORT || 8080;

// server.listen(WS_SERVER_PORT, () => {
//   console.log(`WebSocket server is running on ws://localhost:${WS_SERVER_PORT}`);
// });

// server.on('error', (err: any) => {
//   console.error(`Error starting server on port ${WS_SERVER_PORT}:`, err);
//   process.exit(1);
// });

// export { broadcast };
