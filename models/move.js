const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const moveSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games',
        required: true    
    },
    row: {
        type: Number,
        required: true,
        min: 0,
        max: 2
    },
    col: {
        type: Number,
        required: true,
        min: 0,
        max: 2
    }
});

const Move = new mongoose.model('Moves', moveSchema);

function validateMove(move)
{
    const schema = Joi.object({
        gameId: Joi.string().required(),
        row: Joi.number().min(0).max(2).required(),
        col: Joi.number().min(0).max(2).required()
    });

    return schema.validate(move);
}

exports.Move = Move;
exports.validate = validateMove;