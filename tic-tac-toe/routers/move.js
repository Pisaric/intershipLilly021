const config = require('config');
const _ = require('lodash');
const asyncMiddleware = require('../middleware/async')
const express = require('express');
const router = express.Router();
const { Move, validate } = require('../models/move.js');
const { Board, validateBoard, isFinished, checkWinner, isMoveValid, nextPlayer } = require('../models/board.js');
const { Game } = require('../models/game.js');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');
const { makeBotMove } = require('../service/bot');

router.get('/', async (req, res) => {
    const move = await Move.findById(req.body._id).populate('gameId');
    res.send(move);
});

router.post('/multiPlayer', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let move = new Move(
        _.pick(req.body, ['gameId', 'row', 'col'])
    )

    let createdMove = await move.save();
    let retVal = await drawMove(createdMove);

    if(!(retVal.isValid)) {
        return res.status(400).send(retVal.message);
    }

    if(retVal.isValid && retVal.message !== '') {
        return res.status(200).send(retVal.message);
    }

    res.header().send(createdMove);
});

router.post('/singlePlayer', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let move = new Move(
        _.pick(req.body, ['gameId', 'row', 'col'])
    )

    let createdMove = await move.save();
    let retVal = await drawMove(createdMove);

    if(!(retVal.isValid)) {
        return res.status(400).send(retVal.message);
    }

    if(retVal.isValid && retVal.message !== '') {
        return res.status(200).send(retVal.message);
    }

    let game = await Game.findById(move.gameId);
    let board = await Board.findById(game.board);
    let botMove = makeBotMove(board.board);
    
    let newMove = new Move(
        _.pick(req.body, ['gameId'])
    );
    
    newMove.row = botMove.row;
    newMove.col = botMove.col;
    retVal = await drawMove(newMove);
    
    if(!retVal.isValid) {
        console.log('ovde');
        return res.status(400).send(retVal.message);
    }
    
    if(retVal.isValid && retVal.message !== '') {
        return res.status(200).send(retVal.message);
    }

    res.header().send(createdMove);
});

async function drawMove(move) {
    let retMessage = {isValid: true, message: ''};
    let game = await Game.findById(move.gameId);
    let board = await Board.findById(game.board);
    
    if(!isMoveValid(board, move)) {
        retMessage.isValid = false;
        retMessage.message = 'Move is not valid.';
        return retMessage;
    }
    board.board[move.row][move.col] = board.currentPlayer;

    const winner = checkWinner(board.board);
    if(winner === null) {
        board.currentPlayer = nextPlayer(board);    
    } else if(winner === 'X') {
        console.log('X is winner');
        retMessage.isValid = true;
        retMessage.message = 'X is winner.';
        board.winner = 'X';
        return retMessage;
    } else {
        console.log('O is winner');
        retMessage.isValid = true;
        retMessage.message = 'O is winner.';
        board.winner = 'O';
        return retMessage;
    }

    if(isFinished(board.board))
    {
        console.log('DRAW');
        retMessage.isValid = true;
        retMessage.message = 'Draw.';
        board.isDraw = true;
        return retMessage;
    }
    
    let newBoard = board.save();
    return retMessage;
}


router.put('/:id', async (req, res) => {
    let move = await Move.findById(req.params.id);
    if(!move)
    {
        return res.status(404).send('The move with the given ID was not found');
    }

    move.set(req.body);              
    const updatedMove = await move.save();

    res.header().send(updatedMove);
});

router.delete('/:id', async (req, res) => {
    let move = await Move.findById(req.params.id);
    if(!move) return res.status(404).send('The move with the given ID was not found');

    //Delete
    move.isDeleted = true;
    const updatedMove = await move.save();

    //Return the same course
    res.send(updatedMove);
});

module.exports = router;

