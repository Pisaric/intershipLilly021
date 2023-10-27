const mongoose = require('mongoose');
const Joi = require('joi');
const { join } = require('lodash');
const { Board } = require('./board');

const gameSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Boards'
    },
    xPlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    oPlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: null   
    },
    winner: { 
        type: String, 
        enum: [null, 'X', 'O'], 
        default: null 
    },
    isDraw: { 
        type: Boolean,
        default: false 
    },
    result: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Result'
    },
    type: {
        type: String,
        enum: ['multiplayer', 'singleplayer'],
    }
});



const Game = mongoose.model('Games', gameSchema);

module.exports.Game = Game;
