const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {cors: { origin: "*" }});

let users = [];
let games = [];

io.on('connect', (socket) => {
    //console.log("connected: " + socket.id);
    socket.connected = true;

    socket.on("join server", (username, userId) => {
        const user = {
            username,
            userId,
            id: socket.id
        }
        users.push(user);
        //console.log(users);
        //io.emit("new user", users);
    });


});

module.exports.app = app;
module.exports.server = server;
module.exports.io = io;
module.exports.users = users;
module.exports.games = games;