import React, { Component } from "react";
import http from "../service/httpService";
import { getCurrentUser } from "../service/authService";
import "./style/board.css";
import { IBoard } from "../model/board";
import { IGame } from "../model/game";

const apiEndpoint = "http://localhost:3000/api/";

interface SinglePlayerState {
  board: IBoard | null;
  newGame: IGame | null;
}

class SinglePlayer extends Component<{}, SinglePlayerState> {
  state: SinglePlayerState = {
    board: null,
    newGame: null
  };

  constructor(props: {}) {
    super(props);

  }

  handlerButton = async () => {
    let { board, newGame } = this.state;
    const decoded = getCurrentUser();
    const xPlayer = decoded._id;
    const type = "singleplayer";
    await http
      .post(apiEndpoint + "games", { xPlayer, type }, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      })
      .then((response) => {
        newGame = response.data;
        board = response.data.board;
        this.setState({ board, newGame });
      });
  };

  displayResult = () => {
    let { board } = this.state;
    if(board === null) return;
    if (board.isDraw) {
      return <h2>DRAW</h2>;
    } else if (board.winner === 'X') {
      return <h2>X is winner</h2>;
    } else if (board.winner === 'O') {
      return <h2>O is winner</h2>;
    }
  };

  handleClick = async (row: number, col: number) => {
    let { newGame, board } = this.state;
    if(board === null) return;
    if(newGame === null) return;
    if (board.winner !== null || board.isDraw) return;
    const gameId = newGame._id;
    if (board === null || board.board[row][col] !== null) return;
    await http
      .post(apiEndpoint + "moves/singleplayer", { gameId, row, col }, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      })
      .then((res) => {
        board = res.data;
        this.setState({ board });
      })
      .catch((ex) => {
        console.log(ex);
      });
    if (board.winner === null && !board.isDraw) {
      this.botMove();
    }
    this.displayResult();
  };

  botMove = async () => {
    let { newGame, board } = this.state;
    if(newGame === null) return;
    const gameId = newGame._id;
    await http
      .post(apiEndpoint + "moves/botplay", { gameId })
      .then((res) => {
        board = res.data;
        this.setState({ board });
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  displayBoard = () => {
    let { newGame, board } = this.state;
    if (newGame === null) {
      return null;
    }
    if(board === null) return null;
    return (
      <React.Fragment>
        <div className="row row-cols-3">
          <div
            className="col border cell text-center"
            onClick={() => this.handleClick(0, 0)}
          >
            {board.board[0][0] === null ? '' : board.board[0][0]}
          </div>
          <div
            className="col border cell text-center"
            onClick={() => this.handleClick(0, 1)}
          >
            {board.board[0][1] === null ? '' : board.board[0][1]}
          </div>
          <div
            className="col border cell text-center"
            onClick={() => this.handleClick(0, 2)}
          >
            {board.board[0][2] === null ? '' : board.board[0][2]}
          </div>
        </div>
        <div className="row row-cols-3">
          <div
            className="col border cell text-center"
            onClick={() => this.handleClick(1, 0)}
          >
            {board.board[1][0] === null ? '' : board.board[1][0]}
          </div>
          <div
            className="col border cell text-center"
            onClick={() => this.handleClick(1, 1)}
          >
            {board.board[1][1] === null ? '' : board.board[1][1]}
          </div>
          <div
            className="col border cell text-center"
            onClick={() => this.handleClick(1, 2)}
          >
            {board.board[1][2] === null ? '' : board.board[1][2]}
          </div>
        </div>
        <div className="row row-cols-3">
          <div
            className="col border cell text-center"
            onClick={() => this.handleClick(2, 0)}
          >
            {board.board[2][0] === null ? '' : board.board[2][0]}
          </div>
          <div
            className="col border cell text-center"
            onClick={() => this.handleClick(2, 1)}
          >
            {board.board[2][1] === null ? '' : board.board[2][1]}
          </div>
          <div
            className="col border cell text-center"
            onClick={() => this.handleClick(2, 2)}
          >
            {board.board[2][2] === null ? '' : board.board[2][2]}
          </div>
        </div>
      </React.Fragment>
    );
  };

  displayButton = () => {
    let { newGame, board } = this.state;
    if (newGame === null) {
      return <button onClick={this.handlerButton}> Start game </button>;
    }
    if(board === null) return;
    if (board.winner !== null || board.isDraw) {
      return <button onClick={this.handlerButton}> New game </button>;
    }
  };

  render() {
    return (
      <div className="container text-center">
        <h1>SinglePlayer</h1>
        {this.displayButton()}
        {this.displayResult()}
        {this.displayBoard()}
      </div>
    );
  }
}

export default SinglePlayer;
