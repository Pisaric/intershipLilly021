const mongoose = require('mongoose');
const Joi = require('joi');

const boardSchema = new mongoose.Schema({
  board: {
    type: [
      [
        {
          type: String,
          enum: [null, 'X', 'O'],
          default: null
        }
      ]
    ],
    default: () => Array(3).fill(null).map(() => Array(3).fill(null))
  },
  currentPlayer: {
      type: String, 
      enum: ['X', 'O'], 
      default: 'X' 
  },
  winner: { 
      type: String,
      enum: [null, 'X', 'O'],
      default: null 
  },
  isDraw: {
      type: Boolean,
      default: false 
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

function validateBoard(board) {
  const schema = Joi.object({
    currentPlayer: Joi.string().required()
  });
  return schema.validate(board);
}

function isFinished(board){
    for(let row = 0; row < 3; row++) {
        for(let col = 0; col < 3; col++)
        {
            if(board[row][col] === null)
            {
                return false;
            }
        }
    }
    return true;
}

function checkWinner(board) {
    for (let i = 0; i < 3; i++) {       
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {  //horizontale
        if (board[i][0] !== null) {
          return board[i][0];                           
        }
      }
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {   //vertikale
        if (board[0][i] !== null) {
          return board[0][i]; 
        }
      }
    }
  
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {   //glavna dijagonala
      if (board[0][0] !== null) {
        return board[0][0]; 
      }
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {  //sporedna dijagonala
      if (board[0][2] !== null) {
        return board[0][2]; 
      }
    }
  
    return null;  //draw
  }
  
const Board = mongoose.model('Boards', boardSchema);

exports.Board = Board;
exports.validate = validateBoard;
exports.isFinished = isFinished;
exports.checkWinner = checkWinner;
