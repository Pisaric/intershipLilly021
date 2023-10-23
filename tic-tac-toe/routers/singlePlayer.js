const config = require('config');
const _ = require('lodash');
const asyncMiddleware = require('../middleware/async')
const express = require('express');
const router = express.Router();
const { Move } = require('../models/move.js');
const { Board, validateBoard, isFinished, checkWinner, isMoveValid, nextPlayer } = require('../models/board.js');
const { Game } = require('../models/game.js');

const botSymbol = 'O';

function minimax(board, depth, maximizingPlayer) {
  if (checkWinner(board, botSymbol)) {
    return 1;
  }
  if (checkWinner(board, playerSymbol)) {
    return -1;
  }
  if (isFinished(board)) {
    return 0;
  }

  if (maximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = botSymbol;
        const score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = playerSymbol;
        const score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Function to make the bot's move
function makeBotMove() {
  let bestMove;
  let bestScore = -Infinity;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = botSymbol;
      const score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  board[bestMove] = botSymbol;
  // Implement the logic to update the UI with the bot's move
}
