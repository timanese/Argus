const server = require('./../app.js'); // Replace with the actual path to your app.js

const roomLocations = {}; // Store locations by room ID

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join a room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Joined room ${roomId}`);

      // Send stored locations for this room to the newly joined client
      if (roomLocations[roomId]) {
        socket.emit('updateLocations', roomLocations[roomId]);
      }
    });

    // Listen for location updates from the user client
    socket.on('sendLocation', ({ roomId, location }) => {
      console.log('Received location:', location);

      // Store this location in the room's location list
      if (!roomLocations[roomId]) {
        roomLocations[roomId] = [];
      }
      roomLocations[roomId].push(location);

      // Broadcast this location to the emergency client in the same room
      io.to(roomId).emit('updateLocation', location);
    });

    
  });
};
