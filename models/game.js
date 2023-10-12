const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Board'
    },
    xPlayer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    yPlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        required: true,
        ref: 'Result'
    }
});

const Game = mongoose.model('Games', gameSchema);

module.exports = TicTacToe;
