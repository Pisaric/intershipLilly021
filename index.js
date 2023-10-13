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
const express = require('express');
const app = express();

if(!config.get('jwtPrivateKey'))
{
    console.error('FATAL ERORR: jwtPrivateKey is not defined.');
    process.exit(1); //0 oznacava dobro sve ostalo oznacava gresku
}

mongoose.connect('mongodb+srv://milos:milos@cluster0.5ybabm5.mongodb.net/intershipLilly021')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/boards', boards);
app.use('/api/moves', moves);
app.use('/api/games', games);
app.use('/api/auth', auth);

app.use(error); //ovo nije poziv fje nego ref na tu fju


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));