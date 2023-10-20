const config = require('config');
const _ = require('lodash');
const asyncMiddleware = require('../middleware/async');
const express = require('express');
const router = express.Router();
const { Game } = require('../models/game.js');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');
const { Board } = require('../models/board.js');


router.get('/', async (req, res) => {
    const game = await Game.findById(req.body._id)
                            .populate('board')
                            .populate('xPlayer');
    res.send(game);
});

router.get('/allForUser', async (req, res) => {
    const games = await Game.find({
        $or: [
          { xPlayer: req.body.playerId },
          { oPlayer: req.body.playerId },
        ],
      }).populate('xPlayer').populate('oPlayer');
    res.send(games);
});

router.post('/', auth, async (req, res) => {
    //const { error } = validate(req.body);
    //if(error) return res.status(400).send(error.details[0].message);

    let board = new Board(
        _.pick(req.body, ['xPlayer'])
    )
    board = await board.save();

    let game = new Game(
        _.pick(req.body, ['xPlayer', 'type'])
    )
    
    game.board = board._id;
    let createdGame = await game.save();


    res.header().send(await Game.findById(createdGame._id).populate('board'));
});

router.put('/join/:id', auth, async (req, res) => {
    let game = await Game.findById(req.params.id);
    if(!game) return res.status(404).send('The game with the given Id was not found');
    if(!game) return res.status(400).send('The game with the given ID is not multiplayer.');
    if(!game) return res.status(400).send('Someone already joined in game.');

    game.oPlayer = req.body._id;
    const updatedGame = await game.save();

    res.header().send(updatedGame);
});

/*
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
*/
module.exports = router;


