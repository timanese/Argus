const io = require('socket.io-client');

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to the server');

  // Join a room
  socket.emit('joinRoom', '123');

  console.log("Sending location");

  // Send location
  socket.emit('sendLocation', {
    roomId: '123',
    location: {
      latitude: 1.0,
      longitude: 1.0,
    },
  });

});
