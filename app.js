const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`));

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

let connectedUsers = 0;

io.on('connection', onConnected);

function onConnected(socket) {
    if (connectedUsers >= 2) {
        // If there are already 2 users connected, reject the connection
        socket.emit('connection-rejected', 'Only two users can connect at once.');
        socket.disconnect(true); // Disconnect the socket
        return;
    }

    console.log('Socket connected', socket.id);
    connectedUsers++; // Increment the count of connected users
    io.emit('clients-total', connectedUsers);

    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
        connectedUsers--; // Decrement the count of connected users
        io.emit('clients-total', connectedUsers);
    });

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-message', data);
    });
}
