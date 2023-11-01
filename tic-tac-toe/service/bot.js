const {  isFinished, checkWinner } = require('../models/board.js');

  
  
function minimax(board, depth, maximizingPlayer) {
    const winner = checkWinner(board);
    if(winner === 'X') {
        return -10;
    } else if(winner === 'O') {
        return 10;
    } else {
        if(isFinished(board)) {
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