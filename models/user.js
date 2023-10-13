const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const { join } = require('lodash');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    surname: {
        type: String,
        require: true
    },
    username: {
        type: String,
        minlength: 5,
        require: true,
        unique: true
    },
    password: {
        type: String, 
        require: true,
        minlength: 5
    },
    email: {
        type: String,
        require: true,
        minlength: 5,
        unique: true
    },

});

const User = new mongoose.model('Users', userSchema);

function generateAuthToken(user)
{
    return jwt.sign({ _id: user._id}, config.get('jwtPrivateKey'));
}

userSchema.methods.generateAuthToken = function()
{
    const token = jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'));
    return token;
}


function validateUser(user)
{
    const schema = Joi.object({
        name: Joi.string().required(),
        surname: Joi.string().required(),
        username: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
        email: Joi.string().min(5).required().email()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
exports.generateAuthToken = generateAuthToken;