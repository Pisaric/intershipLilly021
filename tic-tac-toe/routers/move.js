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

const { io, users, games } = require('../template');

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
/* 
    if(!(retVal.isValid)) {
        return res.status(400).send(retVal.message);
    }

    if(retVal.isValid && retVal.message !== '') {
        return res.status(200).send(retVal.message);
    }
 */
    let game = null;
    for(let i = 0; i < games.length; i++) {
        if(games[i].id.equals(move.gameId)) { 
            game = games[i];
            break;
        }
    }
    
    let gameTmp = await Game.findById(move.gameId);
    let board = await Board.findById(gameTmp.board);
    io.to(game.xPlayer.id).to(game.oPlayer.id).emit('updatedBoard', board);
    
    res.header().send(board);
});

router.post('/botplay', async (req, res) => {
    let game = await Game.findById(req.body.gameId);
    let board = await Board.findById(game.board);
    let botMove = await makeBotMove(board.board);
    
    let newMove = new Move(
        _.pick(req.body, ['gameId'])
    );

    newMove.row = botMove.row;
    newMove.col = botMove.col;
    await newMove.save();
    const retVal = await drawMove(newMove);
  
    
    if(!retVal.isValid) {
        return res.status(400).send(retVal.message);
    }
    /*
    if(retVal.isValid && retVal.message !== '') {
        console.log('ovde1')
        return res.status(200).send(retVal.message);
    }
    */
    let newBoard = await Board.findById(game.board);
   
    return res.header().send(newBoard);
});

router.post('/singlePlayer', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let move = new Move(
        _.pick(req.body, ['gameId', 'row', 'col'])
    )

    let createdMove = await move.save();
    const retVal = await drawMove(createdMove);

    if(!(retVal.isValid)) {
        return res.status(400).send(retVal.message);
    }
    /*
    if(retVal.isValid && retVal.message !== '') {
        return res.status(200).send(retVal.message);
    }
    */
    let game = await Game.findById(move.gameId);
    let board = await Board.findById(game.board);

    res.header().send(board);
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
        game.winner = 'X';
    //    board.save();
    //    return retMessage;
    } else {
        console.log('O is winner');
        retMessage.isValid = true;
        retMessage.message = 'O is winner.';
        board.winner = 'O';
        game.winner = 'O';
    //   board.save();
    //    return retMessage;
    }

    if(isFinished(board.board))
    {
        console.log('DRAW');
        retMessage.isValid = true;
        retMessage.message = 'Draw.';
        board.isDraw = true;
        game.isDraw = true;
    //    board.save();
    //    return retMessage;
    }
    
    await game.save();
    await board.save();
    
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


