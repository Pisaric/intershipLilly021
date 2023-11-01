import * as mongoose from 'mongoose';
import * as Joi from 'joi';

interface IBoard extends mongoose.Document {
  board: string[][];
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | null;
  isDraw: boolean;
  isDeleted: boolean;
}

const boardSchema = new mongoose.Schema<IBoard>({
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

function validateBoard(board: IBoard): Joi.ValidationResult {
  const schema = Joi.object({
    currentPlayer: Joi.string().required()
  });
  return schema.validate(board);
}

function isFinished(board: string[][]): boolean {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        return false;
      }
    }
  }
  return true;
}

function checkWinner(board: string[][]): 'X' | 'O' | null {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      if (board[i][0] !== null) {
        return board[i][0] === 'X' ? 'X' : 'O';
      }
    }
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
      if (board[0][i] !== null) {
        return board[0][i] === 'X' ? 'X' : 'O';
      }
    }
  }

  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0] !== null) {
      return board[0][0] === 'X' ? 'X' : 'O';
    }
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2] !== null) {
      return board[0][2] === 'X' ? 'X' : 'O';
    }
  }

  return null;
}

function isMoveValid(board: IBoard, move: { row: number; col: number }): boolean {
  if (board.board[move.row][move.col] !== null) {
    return false;
  }
  return true;
}

function nextPlayer(board: IBoard): 'X' | 'O' {
  return board.currentPlayer === 'X' ? 'O' : 'X';
}

const Board = mongoose.model<IBoard>('Boards', boardSchema);

export { Board, validateBoard, isFinished, checkWinner, isMoveValid, nextPlayer };
