const config = require('config');
const _ = require('lodash');
const asyncMiddleware = require('../middleware/async')
const express = require('express');
const router = express.Router();
const { Move } = require('../models/move.js');
const { Board, validateBoard, isFinished, checkWinner, isMoveValid, nextPlayer } = require('../models/board.js');
const { Game } = require('../models/game.js');

  
  
function minimax(board, depth, maximizingPlayer) {
    if (isFinished(board)) {
        if (checkWinner(board)) {
            return 1;
        } else if (checkWinner(board)) {
            return -1;
        } else {
            return 0;
        }
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === null) {
            board[i][j] = 'O';
            const eval = minimax(board, depth + 1, false);
            board[i][j] = null;
            maxEval = Math.max(maxEval, eval);
            }
        }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === null) {
            board[i][j] = 'X';
            const eval = minimax(board, depth + 1, true);
            board[i][j] = null;
            minEval = Math.min(minEval, eval);
            }
        }
        }
        return minEval;
    }
}

function makeBotMove(board) {
    let bestMove;
    let bestScore = -Infinity;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
            board[i][j] = 'O';
            const score = minimax(board, 0, false);
            board[i][j] = null;
            if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
            }
        }
        }
    }

    return bestMove
}

exports.makeBotMove = makeBotMove;