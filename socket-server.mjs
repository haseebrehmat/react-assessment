// Simple Socket.IO server
import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Handle messages
  socket.on('message', (msg) => {
    console.log('Received message:', msg);
    // Echo: broadcast message back to the client who sent it
    socket.emit('message', {
      text: `Echo: ${msg.text}`,
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Send welcome message
  socket.emit('message', {
    text: 'Welcome to WebSocket Echo Server!',
    senderId: 'system',
    timestamp: new Date().toISOString(),
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});