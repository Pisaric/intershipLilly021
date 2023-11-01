import { BoardModel as Board, IBoard, checkWinner, isFinished } from '../models/board.js';

function minimax(board: IBoard, depth: number, maximizingPlayer: boolean): number {
    const winner = checkWinner(board);

    if (winner === 'X') {
        return -10;
    } else if (winner === 'O') {
        return 10;
    } else {
        if (isFinished(board)) {
            return 0;
        }
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board.board[i][j] === null) {
                    board.board[i][j] = 'O';
                    const score = minimax(board, depth + 1, false);
                    board.board[i][j] = null;
                    maxEval = Math.max(maxEval, score);
                }
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board.board[i][j] === null) {
                    board.board[i][j] = 'X';
                    const score = minimax(board, depth + 1, true);
                    board.board[i][j] = null;
                    minEval = Math.min(minEval, score);
                }
            }
        }
        return minEval;
    }
}

function makeBotMove(board: IBoard): { row: number, col: number } {
    let bestMove: { row: number, col: number };
    let bestScore = -Infinity;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board.board[i][j] === null) {
                board.board[i][j] = 'O';
                const score = minimax(board, 0, false);
                board.board[i][j] = null;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }

    return bestMove;
}

export { makeBotMove };
