const io = require('socket.io-client');
const fs = require('fs');

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to the server');

  // Join a room
  socket.emit('joinRoom', '6506d6a45d745e220017eeea', () => {
    console.log('Server acknowledged joinRoom');
  });

  // Send location
  socket.emit('sendLocation', {
    roomId: '6506d53c5d745e220017eec6',
    meetingId: '6506d53c5d745e220017eec6',
    location: {
      lat: 5.0,
      long: 8.0,
    },
  }, () => {
    console.log('Server acknowledged sendLocation');
  });

  console.log("Sending location");

    // Read an audio file into a buffer
  fs.readFile('./../../../alex-productions-walking-home.mp3', (err, buffer) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
    // const base64Audio = buffer.toString('base64');
    // console.log("Sending audio" + base64Audio);
    // Send the audio buffer
    socket.emit('sendAudio', {
      roomId: '6506d6a45d745e220017eeea',
      meetingId: '6506d6a45d745e220017eeea',
      audioBuffer: buffer
    }, () => {
      console.log('Server acknowledged sendAudio');
    });
  });

  // Comment this out for now
  // socket.disconnect();
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});