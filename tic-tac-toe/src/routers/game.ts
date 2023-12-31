import _ from 'lodash';
import express from 'express';
const router = express.Router();
import { GameModel as Game, IGame } from '../models/game.js';
import { User } from '../models/user.js';
import auth from '../middleware/auth.js';
import { BoardModel as Board } from '../models/board.js';

import { io, users, games, GameSocket } from '../socket.js';

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
    let gamesHistory: IGame[] = [];
    const allGames: IGame[] = await Game.find().populate('xPlayer').populate('oPlayer').populate('board');
    for (let i = 0; i < allGames.length; i++) {
        const tmpGame = allGames[i];
        if(tmpGame.type.toString() === "multiplayer" && (tmpGame.xPlayer === null || tmpGame.oPlayer === null)) continue;
        if (tmpGame.type.toString() === "singleplayer" && tmpGame.xPlayer._id.toString() === req.params.playerId.toString()) {
            gamesHistory.push(tmpGame);
        } else if (tmpGame.type.toString() === "multiplayer" && (tmpGame.xPlayer._id.toString() === req.params.playerId.toString() || tmpGame.oPlayer._id.toString() === req.params.playerId.toString())) {
            gamesHistory.push(tmpGame);
        }
    }

    res.send(gamesHistory);
});

async function deleteOthers(xPlayer: string) {
    const allGames = await Game.find();

    for(let i = 0; i < allGames.length; i++) {
        if(allGames[i].xPlayer.toString() === xPlayer ) {
            const board = await Board.findById(allGames[i].board);
            if(!board.isDraw && board.winner === null) {
                await Game.findByIdAndDelete(allGames[i]._id);
            }
        }
    }

}

router.post('/', auth, async (req, res) => {
    await deleteOthers(req.body.xPlayer);

    let board = new Board(
        _.pick(req.body, ['xPlayer'])
    );
    board = await board.save();

    let game = new Game(
        _.pick(req.body, ['xPlayer', 'type'])
    );
    
    game.board = board._id;
    await game.save();

    if (game.type === 'multiplayer') {
        let newGame: GameSocket = {
            id: game._id,
            xPlayer: users.find(u => u.userId.toString() === req.body.xPlayer),
            oPlayer: null
        };

        game.xPlayer = await User.findById(game.xPlayer);

        for (let i = 0; i < users.length; i++) {
            if (users[i].userId !== game.xPlayer.toString()) {
                io.to(users[i].id).emit('newgame', game);
            }
        }

        games.push(newGame);
    }

    game.board = board;
    res.send(game);
});

router.put('/join/:id', auth, async (req, res) => {
    let game = await Game.findById(req.params.id).populate('xPlayer').populate('board');
    if (!game) return res.status(404).send('The game with the given Id was not found');

    game.oPlayer = req.body.oPlayer;
    game.save();
    game.oPlayer = await User.findById(req.body.oPlayer);

    let joinedGame = games.find((g) => g.id.toString() === req.params.id);
    const index = games.indexOf(joinedGame);
    joinedGame.oPlayer = users.find((u) => u.userId == req.body.oPlayer);

    games[index] = joinedGame;


    let gameTmp: GameSocket | null = null;
    for (let i = 0; i < games.length; i++) {
        if (games[i].id.toString() === game._id.toString()) {
            gameTmp = games[i];
            break;
        }
    }
    io.to(gameTmp.xPlayer.id).to(gameTmp.oPlayer.id).emit('joinedGame', game);

    res.send(game);
});

router.get('/join/:playerId', async (req, res) => {
    const games = await Game
                .find({ type: 'multiplayer', xPlayer: { $ne: req.params.playerId }, oPlayer: null })
                .populate('xPlayer')
                .populate('board');
    res.send(games);
});

export default router;
