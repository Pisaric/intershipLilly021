const config = require('config');
const _ = require('lodash');
const asyncMiddleware = require('../middleware/async')
const express = require('express');
const router = express.Router();
const { Move } = require('../models/move.js');
const { Board } = require('../models/board.js');
const { Game } = require('../models/game.js');


router.post('/myTurn', async (req, res) => {
  

});

// Define constants for the players
const EMPTY = 0;
const PLAYER_X = 1;
const PLAYER_O = 2;

function minimax(board, depth, isMaximizing) {
  const result = evaluate(board);

  if (result !== null) {
    return result;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === EMPTY) {
          board[row][col] = PLAYER_X;
          const score = minimax(board, depth + 1, false);
          board[row][col] = EMPTY;
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === EMPTY) {
          board[row][col] = PLAYER_O;
          const score = minimax(board, depth + 1, true);
          board[row][col] = EMPTY;
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

function findBestMove(board) {
  let bestMove = { row: -1, col: -1 };
  let bestScore = -Infinity;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === EMPTY) {
        board[row][col] = PLAYER_X;
        const score = minimax(board, 0, false);
        board[row][col] = EMPTY;
        if (score > bestScore) {
          bestScore = score;
          bestMove = { row, col };
        }
      }
    }
  }

  return bestMove;
}

// Usage example:
const board = [
  [EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY]
];

const bestMove = findBestMove(board);
console.log(`Best Move: Row ${bestMove.row}, Col ${bestMove.col}`);
