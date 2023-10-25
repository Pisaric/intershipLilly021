//require('express-async-errors');
//const winston = require('winston');
const error = require('./middleware/error');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routers/user');
const boards = require('./routers/board');
const moves = require('./routers/move');
const games = require('./routers/game');
const auth = require('./routers/auth');
const cors = require('cors');
const express = require('express');
//const http = require('http');
//const { Server } = require('socket.io');


//const app = express();
//const server = http.createServer(app);
//const io = require('socket.io')(server, {cors: { origin: "*" }});
const { app, server, io } = require('./template');


if(!config.get('jwtPrivateKey'))
{
    console.error('FATAL ERORR: jwtPrivateKey is not defined.');
    process.exit(1); //0 oznacava dobro sve ostalo oznacava gresku
}

mongoose.connect('mongodb+srv://milos:milos@cluster0.5ybabm5.mongodb.net/intershipLilly021')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB...'));

const corsOptions = {
    origin: '*',
};
    
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/boards', boards);
app.use('/api/moves', moves);
app.use('/api/games', games);
app.use('/api/auth', auth);


app.use(error); //ovo nije poziv fje nego ref na tu fju

/*
let joinedUsers = [];

io.on('connection', (socket) => {
    /* socket.on("join server", (username) => {
        const user = {
            username,
            id: socket.id
        }
        this.joinedUsers.push(user);
        io.emit("new user", users);
    } )

    socket.on('join room', (roomName, cb) => {
        socket.join(roomName);
        cb(message[roomName]);
        //socket.emit("joined", messages[roomName]);
    });

    socket.on("disconnect", () => {
        //users = users.filter(u => u.id !== socket.id);
        io.emit("new user", users);
    })
    console.log('A user connected: ' + socket.id);
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    }); 

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('message', data);
    });

    socket.on('join game', socket => {
        const user = {
            username,
            id: socket.id
        }
        users.push(user);
        io.emit('new user', users);
    }) 



}); */

const port = process.env.PORT || 3000;
server.listen(port, () => 
    console.log(`Listening on port ${port}...`)
);

