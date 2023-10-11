const mongoose = require('mongoose');
const Joi = require('joi');

const gameSchema = new mongoose.Schema({
    type:
    {
        type: String,
        require: true,
        enum: ['multiplayer', 'singleplayer']
    },
    status:
    {
        type: String,
        require: true,
        enum: ['inprogress', 'iksWinner', 'oksWinner', 'draw']
    },
    iksPlayer:
    {

    },
    oksPlayer: 
    {

    }
});
