const config = require('config');
const _ = require('lodash');
const asyncMiddleware = require('../middleware/async')
const express = require('express');
const router = express.Router();
const { Move, validate } = require('../models/move.js');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');


router.get('/', async (req, res) => {
    const move = await Move.findById(req.body._id).populate('gameId');
    res.send(move);
});


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let move = new Move(
        _.pick(req.body, ['gameId', 'row', 'col'])
    )

    let createdMove = await move.save();

    res.header().send(createdMove);
});

router.put('/:id', async (req, res) => {
    let move = await Move.findById(req.params.id);
    if(!move)
    {
        return res.status(404).send('The move with the given ID was not found');
    }

    move.set(req.body);              
    const updatedMove = await move.save();

    res.header().send(updatedMove);
})

router.delete('/:id', async (req, res) => {
    let move = await Move.findById(req.params.id);
    if(!move) return res.status(404).send('The move with the given ID was not found');

    //Delete
    move.isDeleted = true;
    const updatedMove = await move.save();

    //Return the same course
    res.send(updatedMove);
})

module.exports = router;


