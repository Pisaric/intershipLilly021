class Board {
    constructor() {
      this.grid = Array(3).fill(null).map(() => Array(3).fill(null));
    }
  
    // Make a move (X or O) on the board
    makeMove(row, col, player) {
      if (this.grid[row][col] === null) {
        this.grid[row][col] = player;
        return true; // Move successful
      }
      return false; // Invalid move
    }
  
    // Check if the game is over (win, draw, or ongoing)
    isGameOver() {
      return this.isWin('X') || this.isWin('O') || this.isDraw();
    }
  
    // Check if the game is a draw
    isDraw() {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (this.grid[row][col] === null) {
            return false; // The game is not a draw
          }
        }
      }
      return true; // The game is a draw
    }
  
    // Check if a player has won
    isWin(player) {
      // Check rows, columns, and diagonals
      for (let i = 0; i < 3; i++) {
        if (
          this.grid[i][0] === player &&
          this.grid[i][1] === player &&
          this.grid[i][2] === player
        ) {
          return true; // Row win
        }
        if (
          this.grid[0][i] === player &&
          this.grid[1][i] === player &&
          this.grid[2][i] === player
        ) {
          return true; // Column win
        }
      }
      if (
        this.grid[0][0] === player &&
        this.grid[1][1] === player &&
        this.grid[2][2] === player
      ) {
        return true; // Diagonal win (top-left to bottom-right)
      }
      if (
        this.grid[0][2] === player &&
        this.grid[1][1] === player &&
        this.grid[2][0] === player
      ) {
        return true; // Diagonal win (top-right to bottom-left)
      }
      return false; // No win
    }
  
    // Get the current state of the board
    getState() {
      return this.grid;
    }
  
    // Reset the board to an empty state
    reset() {
      this.grid = Array(3).fill(null).map(() => Array(3).fill(null));
    }
  }
  