import mongoose, { Document, Schema, Model } from 'mongoose';
import Joi from 'joi';

export interface IBoard extends Document {
  board: string[][];
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | null;
  isDraw: boolean;
  isDeleted: boolean;
}

const boardSchema = new Schema<IBoard>({
  board: {
    type: [
      [
        {
          type: String,
          enum: [null, 'X', 'O'],
          default: null,
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

const BoardModel: Model<IBoard> = mongoose.model('Boards', boardSchema);

const boardValidationSchema = Joi.object<IBoard>({
  currentPlayer: Joi.string().valid('X', 'O').required(),
});

function validateBoard(board: IBoard) {
  return boardValidationSchema.validate(board);
}

function isFinished(board: IBoard) {
    for(let row = 0; row < 3; row++) {
        for(let col = 0; col < 3; col++) {
            if(board.board[row][col] === null) {
                return false;
            }
        }
    }
    return true;
}

function checkWinner(board: IBoard) {
    for (let i = 0; i < 3; i++) {
      if (board.board[i][0] === board.board[i][1] && board.board[i][1] === board.board[i][2]) {
        if (board.board[i][0] !== null) {
          return board.board[i][0];
        }
      }
      if (board.board[0][i] === board.board[1][i] && board.board[1][i] === board.board[2][i]) {
        if (board.board[0][i] !== null) {
          return board.board[0][i];
        }
      }
    }

    if (board.board[0][0] === board.board[1][1] && board.board[1][1] === board.board[2][2]) {
      if (board.board[0][0] !== null) {
        return board.board[0][0];
      }
    }
    if (board.board[0][2] === board.board[1][1] && board.board[1][1] === board.board[2][0]) {
      if (board.board[0][2] !== null) {
        return board.board[0][2];
      }
    }

    return null;
}

function isMoveValid(board: IBoard, move: { row: number; col: number }) {
  if (board.board[move.row][move.col] !== null) {
    return false;
  }
  return true;
}

function nextPlayer(board: IBoard) {
  return board.currentPlayer === 'X' ? 'O' : 'X';
}

export { BoardModel, validateBoard, isFinished, checkWinner, isMoveValid, nextPlayer };
