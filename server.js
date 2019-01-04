const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3111, () => {
    console.log('Server Running ')
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    connections.push(socket);
    console.log('connected : %s sockets connected', connections.length);
    // console.log('a user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', connections.indexOf(socket), msg);
        console.log('User %s:  message : ' + msg, connections.indexOf(socket) + 1)
    });

    socket.on('change', () => {
        io.emit('change', connections.indexOf(socket));
        console.log("change initiated");
    })

    socket.on('disconnect', () => {
        io.emit('disconnect', connections.indexOf(socket));
        connections.splice(connections.indexOf(socket), 1);
        console.log('Users connected : %s', connections.length);
    });
});



