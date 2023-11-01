import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
let users = [];
let games = [];
function isExisted(userId) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].userId === userId) {
            return i;
        }
    }
    return -1;
}
function inGame(userId) {
    for (let i = 0; i < games.length; i++) {
        if (games[i].xPlayer.userId === userId) {
            return i;
        }
    }
    return -1;
}
io.on('connection', function (socket) {
    socket.connected = true;
    socket.on("join server", (username, userId) => {
        const indexUser = isExisted(userId);
        if (indexUser !== -1) {
            users[indexUser].id = socket.id;
            const indexGame = inGame(userId);
            if (indexGame !== -1) {
                games[indexGame].xPlayer.id = socket.id;
            }
            return;
        }
        const user = {
            username,
            userId,
            id: socket.id
        };
        users.push(user);
    });
    socket.on("log out", (userId) => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].userId === userId) {
                console.log('Uspesan logout!');
                delete users[i];
            }
        }
    });
});
export { app, server, io, users, games };
//# sourceMappingURL=socket.js.map