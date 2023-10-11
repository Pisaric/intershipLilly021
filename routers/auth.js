const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User } = require('../models/users.js');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Joi = require('joi');


router.get('/', async (req, res) => {
    const user = await User.find().sort('username');
    res.send(user);
})




router.post('', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Invalid email or password.')

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.')

    const token = user.generateAuthToken();
    res.send(token);
});


function validateUser(req)
{
    const schema = {
        password: Joi.string().min(5).required(),
        email: Joi.string().min(5).required()
    }

    return Joi.validate(user, schema);
}

module.exports = router;

