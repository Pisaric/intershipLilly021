const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {cors: { origin: "*" }});

let users = [];
let games = [];

function isExisted(userId) {
    for(let i = 0; i < users.length; i++) {
        if(users[i].userId === userId) {
            return i;
        }
    }
    return -1;
}

function inGame(userId) {
    for(let i = 0; i < games.length; i++) {
        if(games[i].xPlayer.userId === userId) {
            return i;
        }
    }
    return -1;
}

io.on('connect', function(socket) {
    socket.connected = true;


    socket.on("join server", (username, userId) => {
        const indexuser = isExisted(userId);
        if(indexuser !== -1) {
            users[indexuser].id = socket.id;

            const indexGame = inGame(userId);
            if(indexGame !== -1) {
                games[indexGame].xPlayer.id = socket.id;
            }
            console.log(users);
            return;
        }

        const user = {
            username,
            userId,
            id: socket.id
        }
        users.push(user);
        console.log(users);
    });

    socket.on("log out", (userId) => {
        for(let i = 0; i < users.length; i++) {
            if(users[i].userId === userId) {
                delete users[i];
            }
        }
    })

});

module.exports.app = app;
module.exports.server = server;
module.exports.io = io;
module.exports.users = users;
module.exports.games = games;