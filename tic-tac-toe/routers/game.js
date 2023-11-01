const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { Game } = require('../models/game.js');
const { User } = require('../models/user.js');
const auth = require('../middleware/auth.js');
const { Board } = require('../models/board.js');

const { io, users, games } = require('../socket');


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

router.get('/allForUser/:playerId', async (req, res) => {
    let gamesHistory = [];
    console.log('prosledjen');
    console.log(req.params.playerId);
    const allGames = await Game.find().populate('xPlayer').populate('oPlayer');
    for(let i = 0; i < allGames.length; i++) {
        console.log(allGames[i]);
        if(allGames[i].type === 'multiplayer' && (allGames[i].xPlayer === null || allGames[i].yPlayer === null )) continue;
        if(allGames[i].type === 'singleplayer' && allGames[i].xPlayer._id == req.params.playerId)  {
            gamesHistory.push(allGames[i]);
        } else if(allGames[i].type === 'multiplayer' && (allGames[i].xPlayer._id == req.params.playerId || allGames[i].oPlayer._id == req.params.playerId )) {
            gamesHistory.push(allGames[i]);
        }
    }
    res.send(gamesHistory);
});

async function deleteGames(xPlayer) {
    let allGames = await Game.find({ type: 'multiplayer' }).populate('xPlayer').populate('oPlayer');
    for(let i = 0; i < allGames.length; i++) {
        if(allGames[i].xPlayer._id == xPlayer && allGames[i].oPlayer === null) {
            await allGames[i].deleteOne();
        }
    }
    
}

router.post('/', auth, async (req, res) => {
    //const { error } = validate(req.body);
    //if(error) return res.status(400).send(error.details[0].message);
    //deleteGames(req.body.xPlayer);

    let board = new Board(
        _.pick(req.body, ['xPlayer'])
    )
    board = await board.save();

    let game = new Game(
        _.pick(req.body, ['xPlayer', 'type'])
    )
    
    
    game.board = board._id;
    let createdGame = await game.save();

    if(game.type === 'multiplayer') {
        const newGame = {
            id: game._id,
            xPlayer: users.find(u => u.userId === req.body.xPlayer),
            oPlayer: null
        }

        game.xPlayer = await User.findById(game.xPlayer);

        for(let i = 0; i < users.length; i++) {
            if(users[i].userId !== game.xPlayer) {
                io.to(users[i].id).emit('newgame', game);
            }
        }

        games.push(newGame);
    }

    
    res.header().send(await Game.findById(createdGame._id).populate('board'));
});

router.put('/join/:id', auth, async (req, res) => {
    let game = await Game.findById(req.params.id).populate('xPlayer').populate('board');
    if(!game) return res.status(404).send('The game with the given Id was not found');
   // if(!game) return res.status(400).send('The game with the given ID is not multiplayer.');
    //if(!game) return res.status(400).send('Someone already joined in game.');

    game.oPlayer = req.body.oPlayer;
    game.save();


    let joinedGame = await games.find((g) => g.id == req.params.id);
    const index = games.indexOf(joinedGame);
    joinedGame.oPlayer = await users.find((u) => u.userId == req.body.oPlayer);


    games[index] = joinedGame;

    let gameTmp = null;
    for(let i = 0; i < games.length; i++) {
        if(games[i].id.equals(game._id)) { 
            gameTmp = games[i];
            break;
        }
    }
    io.to(gameTmp.xPlayer.id).to(gameTmp.oPlayer.id).emit('joinedGame', game);

    res.header().send(game);
});

router.get('/join/:playerId', async (req, res) => {
    const allGames = await Game
                .find({ type: 'multiplayer', xPlayer: { $ne: req.params.playerId }, oPlayer: null })
                .populate('xPlayer')
                .populate('board');
    res.send(allGames);
})


module.exports = router;


