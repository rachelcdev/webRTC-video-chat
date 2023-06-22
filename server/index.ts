
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

import { Server } from 'socket.io';

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})
app.use(cors());

app.get('/', () => {
    console.log('hello world');
});

io.on('connection', (socket) => {
    // once server opens, send socket id as host id 
    socket.emit('connect', socket.id);
    
    // caller request to hang up
    socket.on('disconnect', () => {
        socket.broadcast.emit('callended');
    });

    socket.on('call-user', ({userToCall, signalData, from, name}) => {
        io.to(userToCall).emit('call-user', {signal: signalData, from, name});
    });

    socket.on('answer-call', ({data}) => {
        io.to(data.id).emit('call-accepted', data.signal);
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log('listening on *:8080');
})