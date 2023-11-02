import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Schema } from 'mongoose';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

interface User {
  username: string;
  userId: string;
  id: string;
}

interface Game {
  xPlayer: User;
  oPlayer: User;
  id: Schema.Types.ObjectId;
}

let users: User[] = [];
let games: Game[] = [];

function isExisted(userId: string): number {
  for (let i = 0; i < users.length; i++) {
    if (users[i].userId === userId) {
      return i;
    }
  }
  return -1;
}

function inGame(userId: string): number {
  for (let i = 0; i < games.length; i++) {
    if (games[i].xPlayer.userId === userId) {
      return i;
    }
  }
  return -1;
}

io.on('connection', function (socket) {
  socket.connected = true;

  socket.on("join server", (username: string, userId: string) => {
    const indexUser = isExisted(userId);
    if (indexUser !== -1) {
      users[indexUser].id = socket.id;

      const indexGame = inGame(userId);
      if (indexGame !== -1) {
        games[indexGame].xPlayer.id = socket.id;
      }
      return;
    }

    const user: User = {
      username,
      userId,
      id: socket.id
    }
    users.push(user);
  });

  socket.on("log out", (userId: string) => {
    for(let i = 0; i < users.length; i++) {
        if(users[i].userId === userId) {
            delete users[i];
        }
    }
})
});

export { app, server, io, users, games, User as UserSocket, Game as GameSocket};
