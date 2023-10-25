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

const { io, users, games } = require('../template');


router.get('/', async (req, res) => {
    const game = await Game.findById(req.body._id)
                            .populate('board')
                            .populate('xPlayer');
    res.send(game);
});

router.get('/multiplayer/:_id', async (req, res) => {
    const game = await Game.findById(req.params._id)
                        .populate('board')
                        .populate('xPlayer')
                        .populate('oPlayer');
    res.send(game);
});

router.get('/allForUser', async (req, res) => {
    let games = [];
    for(let game in Game.find({}).populate('xPlayer').populate('oPlayer')) {
        if(game.type === 'singleplayer' && game.xPlayer === req.body.playerId)  {
            games.append(game);
        } else if(game.type === 'multiplayer' && (game.xPlayer === req.body.playerId || game.yPlayer === req.body.playerId )) {
            games.append(game);
        }
    }  
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
    //TODO
    //Napraviti novu sobu i postaviti id game i uzeti user iz liste users i staviti tu kao xPlayer-a
    if(game.type === 'multiplayer') {
        const newGame = {
            id: game._id,
            xPlayer: users.find(u => u.userId === req.body.xPlayer),
            oPlayer: null
        }
       // game.id = game._id
        //game.xPlayer = users.find(u => u.userId === req.body.xPlayer);
        games.push(newGame);
    }

    res.header().send(await Game.findById(createdGame._id).populate('board'));
});

router.put('/join/:id', auth, async (req, res) => {
    let game = await Game.findById(req.params.id);
    if(!game) return res.status(404).send('The game with the given Id was not found');
   // if(!game) return res.status(400).send('The game with the given ID is not multiplayer.');
    //if(!game) return res.status(400).send('Someone already joined in game.');

    game.oPlayer = req.body.oPlayer;
    game.save();


    let joinedGame = await games.find((g) => g.id == req.params.id);
    const index = games.indexOf(joinedGame);
    joinedGame.oPlayer = await users.find((u) => u.userId == req.body.oPlayer);
    /* 
    for(let i = 0; i < users.length; i++) {
        console.log(users[i].userId);
        console.log(game.oPlayer);
        if(users[i].userId == game.oPlayer) {
            joinedGame.oPlayer = users[i];
            users[i] = joinedGame;
            console.log('Usao u petlju');
            break; 
        }
    } */
    

    games[index] = joinedGame;
   // console.log("join in game" + users.find(u => u.userId === req.body.oPlayer));

    console.log(games);

    res.header().send(game);
});

router.get('/join/:playerId', async (req, res) => {
    const games = await Game
                .find({ type: 'multiplayer', xPlayer: { $ne: req.params.playerId }, oPlayer: null })
                .populate('xPlayer')
                .populate('board');
    res.send(games);
})


module.exports = router;


