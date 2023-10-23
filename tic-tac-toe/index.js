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
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
  
    socket.on('chat message', (message) => {
        io.emit('chat message', message);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => 
    console.log(`Listening on port ${port}...`)
);
