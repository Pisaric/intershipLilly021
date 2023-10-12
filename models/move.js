const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const moveSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'    
    },
    idPlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    move:
    {
        type: Number
    }
});

const Move = new mongoose.model('Moves', moveSchema);


function validateUser(user)
{
    const schema = {
        name: Joi.string().required(),
        surname: Joi.string().required(),
        username: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
        email: Joi.string().min(5).required()
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;