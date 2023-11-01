const express = require('express');
const router = express.Router();
const { Move, validate } = require('../models/move.js');
const { Board, isFinished, checkWinner, isMoveValid, nextPlayer } = require('../models/board.js');
const { Game } = require('../models/game.js');
const auth = require('../middleware/auth.js');
const _ = require('lodash');
const { makeBotMove } = require('../service/bot');
const { io, users, games } = require('../socket');

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
    
    let gameTmp = await Game.findById(move.gameId).populate('board');
    //let board = await Board.findById(gameTmp.board);
    io.to(game.xPlayer.id).to(game.oPlayer.id).emit('updatedBoard', gameTmp.board);
    
    if(isGameOver(gameTmp.board)) {
        for(let i = 0; i < games.length; i++) {
            if(gameTmp._id.equals(games[i].id)) {
                console.log('usao u if');
                delete games[i];
            }
        } 
    }

    res.header().send(gameTmp.board);
});

isGameOver = (board) => {
    return board.isDraw || board.winner !== null;
}

router.post('/botplay', async (req, res) => {
    let game = await Game.findById(req.body.gameId).populate('board');
    let botMove = await makeBotMove(game.board.board);
    
    let newMove = new Move(
        _.pick(req.body, ['gameId'])
    );

    newMove.row = botMove.row;
    newMove.col = botMove.col;
    newMove.save();                     //bio await ali kontam da moze i ovk
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

    return res.header().send(retVal.board);
});

async function drawMove(move) {
    let retMessage = {isValid: true, message: '', board: null};
    let game = await Game.findById(move.gameId).populate('board');
//    let board = await Board.findById(game.board);
    
    if(!isMoveValid(game.board, move)) {
        retMessage.isValid = false;
        retMessage.message = 'Move is not valid.';
        return retMessage;
    }
    game.board.board[move.row][move.col] = game.board.currentPlayer;

    const winner = checkWinner(game.board.board);
    if(winner === null) {
        game.board.currentPlayer = nextPlayer(game.board);    
    } else if(winner === 'X') {
        console.log('X is winner');
        retMessage.isValid = true;
        retMessage.message = 'X is winner.';
        game.board.winner = 'X';
        game.winner = 'X';
    //    board.save();
    //    return retMessage;
    } else {
        console.log('O is winner');
        retMessage.isValid = true;
        retMessage.message = 'O is winner.';
        game.board.winner = 'O';
        game.winner = 'O';
    //   board.save();
    //    return retMessage;
    }

    if(isFinished(game.board.board))
    {
        console.log('DRAW');
        retMessage.isValid = true;
        retMessage.message = 'Draw.';
        game.board.isDraw = true;
        game.isDraw = true;
    //    board.save();
    //    return retMessage;
    }
    
    await game.save();
    await game.board.save();
    retMessage.board = game.board;
    return retMessage;
}


router.post('/singlePlayer', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let move = new Move(
        _.pick(req.body, ['gameId', 'row', 'col'])
    )

    let createdMove = await move.save();
    const retVal = await drawMove(createdMove);s
    if(!(retVal.isValid)) {
        return res.status(400).send(retVal.message);
    }
    /*
    if(retVal.isValid && retVal.message !== '') {
        return res.status(200).send(retVal.message);
    }
    */
    res.header().send(retVal.board);
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


