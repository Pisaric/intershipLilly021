const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User, validate, generateAuthToken } = require('../models/user');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Joi = require('joi');
const config = require('config')
const jwt = require('jsonwebtoken');


router.get('/', async (req, res) => {
    const user = await User.find().sort('username');
    res.send(user);
})


router.post('/', async (req, res) => {
    const { error } = validateCredential(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Invalid email or password.')

    if(user.password !== req.body.password) return res.status(400).send('Invalid email or password.')

    const token = generateAuthToken(user);
    res.send(token);
});


function validateCredential(credential)
{
    console.log(credential);
    const schema = Joi.object({
        password: Joi.string().min(5).required(),
        email: Joi.string().min(5).required()
    });

    return schema.validate(credential);
}

module.exports = router;

