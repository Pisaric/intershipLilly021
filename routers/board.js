const config = require('config');
const _ = require('lodash');
const asyncMiddleware = require('../middleware/async')
const express = require('express');
const router = express.Router();
const { Board, validate } = require('../models/board.js');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');


router.get('/', async (req, res) => {
    const board = await Board.findById(req.body._id);
    res.send(board);
});


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
  
    let board = new Board(
        _.pick(req.body, ['currentPlayer'])
    )

    let = await board.save();

    res.header().send( _.pick(board, ['_id','board', 'currentPlayer', 'winner', 'isDraw']));
});

router.put('/:id', async (req, res) => {
    let board = await Board.findById(req.params.id);
    if(!board)
    {
        return res.status(404).send('The board with the given ID was not found');
    }

    board.set(req.body);              
    const updatedGame = await board.save();

    res.header().send( _.pick(board, ['_id','board', 'currentPlayer', 'winner', 'isDraw']));
})

router.delete('/:id', async (req, res) => {
    let board = await Board.findById(req.params.id);
    if(!board) res.status(404).send('The board with the given ID was not found');

    //Delete
    board.isDeleted = true;
    const updatedGame = await board.save();

    //Return the same course
    res.send(updatedGame)
})

module.exports = router;


