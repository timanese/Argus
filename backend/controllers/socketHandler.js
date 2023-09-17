const server = require("./../app.js"); // Replace with the actual path to your app.js
const { uploadFile } = require("./fileController"); // Import uploadFile function
const { uploadGPSData, uploadAudioData } = require("./meetingController"); // Import uploadGPS function
const roomGPSLogs = {}; // Store locations by room ID
const roomAudioFileIds = {}; // Store audio file IDs for each room
const roomAudioFiles = {}; // Store audio files for each room

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('New client connected');

        // Join a room
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`Joined room ${roomId}`);

            // Initialize GPS logs and audio files for the room if not already initialized
            roomGPSLogs[roomId] = roomGPSLogs[roomId] || [];
            roomAudioFiles[roomId] = roomAudioFiles[roomId] || [];
        });

       // Listen for location updates from the user client
        socket.on('sendLocation', async ({ roomId, location, meetingId }) => {
            // Store this location in the room's location list
            if (!roomGPSLogs[roomId]) {
                roomGPSLogs[roomId] = [];
            }
            roomGPSLogs[roomId].push(location);

            // Upload this location to the database
            const success = await uploadGPSData(meetingId, location);

            if (success) {
                // Broadcast this location to the emergency client in the same room
                io.to(roomId).emit('updateLocation', location, roomGPSLogs[roomId]);
            } else {
                console.error("Failed to upload GPS data");
            }
        });

        // When a user sends a new audio file
        socket.on('sendAudio', async ({ roomId, audioBuffer, meetingId }) => {
            const audioFileId = await uploadFile(audioBuffer); // Assuming uploadFile is your function to upload the audio buffer and get an ID
            // roomAudioFileIds[roomId].push(audioFileId);

             // Upload this location to the database
            const success = await uploadAudioData(meetingId, audioFileId);

            if (success) {
                // Broadcast this location to the emergency client in the same room
                io.to(roomId).emit('updateAudio', audioFileId, audioBuffer);
            } else {
                console.error("Failed to upload Audio data");
            }
        });

        // When an emergency contact joins late and requests past GPS logs
        socket.on('requestPastGPSLogs', (roomId) => {
            socket.emit('pastGPSLogs', roomGPSLogs[roomId]);
        });

        // When an emergency contact joins late and requests past audio files
        socket.on('requestPastAudios', (roomId) => {
            socket.emit('pastAudios', roomAudioFiles[roomId]);
        });

        socket.on('error', (error) => {
            console.log('Socket Error:', error);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};