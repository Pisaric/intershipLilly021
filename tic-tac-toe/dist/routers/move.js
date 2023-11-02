import _ from 'lodash';
import express from 'express';
import { Move, validateMove as validate } from '../models/move.js';
import { BoardModel as Board, isFinished, checkWinner, isMoveValid, nextPlayer } from '../models/board.js';
import { GameModel as Game, } from '../models/game.js';
import { Schema } from 'mongoose';
import auth from '../middleware/auth.js';
import { makeBotMove } from '../services/bot.js';
import { io, games } from '../socket.js';
const app = express();
const router = express.Router();
router.get('/', async (req, res) => {
    const move = await Move.findById(req.body._id).populate('gameId');
    res.send(move);
});
function isGameOver(board) {
    if (board instanceof Schema.Types.ObjectId)
        return false;
    return board.isDraw || board.winner !== null;
}
router.post('/multiPlayer', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let move = new Move(_.pick(req.body, ['gameId', 'row', 'col']));
    let createdMove = await move.save();
    let retVal = await drawMove(createdMove);
    let game = null;
    for (let i = 0; i < games.length; i++) {
        if (games[i].id.toString() === move.gameId.toString()) {
            game = games[i];
            break;
        }
    }
    let gameTmp = await Game.findById(move.gameId).populate('board');
    io.to(game.xPlayer.id).to(game.oPlayer.id).emit('updatedBoard', gameTmp.board);
    if (isGameOver(gameTmp.board)) {
        for (let i = 0; i < games.length; i++) {
            if (gameTmp._id.toString() === games[i].id.toString()) {
                delete games[i];
                games.length--;
                break;
            }
        }
    }
    res.send(gameTmp.board);
});
router.post('/botplay', async (req, res) => {
    let game = await Game.findById(req.body.gameId);
    let board = await Board.findById(game.board);
    if (board === null)
        return;
    let botMove = await makeBotMove(board);
    let newMove = new Move(_.pick(req.body, ['gameId']));
    newMove.row = botMove.row;
    newMove.col = botMove.col;
    await newMove.save();
    const retVal = await drawMove(newMove);
    if (!retVal.isValid) {
        return res.status(400).send(retVal.message);
    }
    let newBoard = await Board.findById(game.board);
    return res.send(newBoard);
});
router.post('/singlePlayer', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let move = new Move(_.pick(req.body, ['gameId', 'row', 'col']));
    let createdMove = await move.save();
    const retVal = await drawMove(createdMove);
    if (!retVal.isValid) {
        return res.status(400).send(retVal.message);
    }
    let game = await Game.findById(move.gameId);
    let board = await Board.findById(game.board);
    res.send(board);
});
async function drawMove(move) {
    let retMessage = { isValid: true, message: '' };
    let game = await Game.findById(move.gameId);
    if (game === null)
        return;
    let board = await Board.findById(game.board);
    if (board === null)
        return;
    if (!isMoveValid(board, move)) {
        retMessage.isValid = false;
        retMessage.message = 'Move is not valid.';
        return retMessage;
    }
    board.board[move.row][move.col] = board.currentPlayer;
    const winner = checkWinner(board);
    if (winner === null) {
        board.currentPlayer = nextPlayer(board);
    }
    else if (winner === 'X') {
        retMessage.isValid = true;
        retMessage.message = 'X is the winner.';
        board.winner = 'X';
        game.winner = 'X';
    }
    else {
        retMessage.isValid = true;
        retMessage.message = 'O is the winner.';
        board.winner = 'O';
        game.winner = 'O';
    }
    if (isFinished(board)) {
        retMessage.isValid = true;
        retMessage.message = 'Draw.';
        board.isDraw = true;
        game.isDraw = true;
    }
    await game.save();
    await board.save();
    return retMessage;
}
router.put('/:id', async (req, res) => {
    let move = await Move.findById(req.params.id);
    if (!move) {
        return res.status(404).send('The move with the given ID was not found');
    }
    move.set(req.body);
    const updatedMove = await move.save();
    res.send(updatedMove);
});
export default router;
//# sourceMappingURL=move.js.map