import React, {Component} from "react";
import http from "../services/httpService";
import { getCurrentUser } from "../services/authService";
import "./style/board.css"

const apiEndpoint = "http://localhost:3000/api/";

class SinglePlayer extends Component {
    state = { 
        board: '',
        newGame: null
    };
    
    handlerButton = async () => {
        let { board, newGame } = this.state;
        const decoded =  getCurrentUser();
        const xPlayer = decoded._id;
        const type = "singleplayer"
        await http.post(apiEndpoint + "games", { xPlayer, type}, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        }).then(response =>  {
            newGame = response.data;
            board = response.data.board;
            this.setState({ board, newGame });
        });
        
    }
    
    displayResult = () => {
        let { board } = this.state;
        if(board.isDraw) {
            return <h2>DRAW</h2>;
        } else if(board.winner === 'X') {
            return <h2>X is winner</h2>;
        } else if(board.winner === 'O'){
            return <h2>O is winner</h2>
        }
    }

    handleClick = async (row, col) => {
        let { board } = this.state;
        if(board.winner !== null || board.isDraw) return;
        const gameId = this.state.newGame._id;
        if(board === null || board.board[row][col] !== null) return;
        await http.post(apiEndpoint + "moves/singleplayer", {gameId, row, col}, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        }).then(res => {
            board = res.data;
            this.setState({ board });
        }).catch(ex => {
            console.log(ex);
        });
        if(board.winner === null && !board.isDraw) {
            await this.botMove();
        }
        this.displayResult();
    }

    botMove = async () => {
        let { board } = this.state;
        const gameId = this.state.newGame._id;
        await http.post(apiEndpoint + "moves/botplay", {gameId}).then(res => {
            console.log('uradio');
            board = res.data;
            this.setState({ board });
            console.log('prikazao');
        }).catch(ex => {
            console.log(ex);
        });
    }
    

    displayBoard = () => {
        let {newGame, board} = this.state;
        if(newGame === null) {
            return null;
        }
        return (
            <React.Fragment>
                <div className="row row-cols-3">
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 0, 0)}> { board.board[0][0] === null ? '' : board.board[0][0] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 0, 1)}> { board.board[0][1] === null ? '' : board.board[0][1] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 0, 2)}> { board.board[0][2] === null ? '' : board.board[0][2] } </div>
                </div>
                <div className="row row-cols-3">
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 1, 0)}> { board.board[1][0] === null ? '' : board.board[1][0] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 1, 1)}> { board.board[1][1] === null ? '' : board.board[1][1] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 1, 2)}> { board.board[1][2] === null ? '' : board.board[1][2] } </div>
                </div>
                <div className="row row-cols-3">
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 2, 0)}> { board.board[2][0] === null ? '' : board.board[2][0] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 2, 1)}> { board.board[2][1] === null ? '' : board.board[2][1] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 2, 2)}> { board.board[2][2] === null ? '' : board.board[2][2] } </div>
                </div>
            </React.Fragment>
        );
    }


    displayButton = () => {
        let { newGame, board } = this.state;
        if(newGame === null) return <button onClick={this.handlerButton}> Start game </button>;
        if(board.winner !== null || board.isDraw) return <button onClick={this.handlerButton}> New game </button>;
    }

    render() { 
        return (
            <div className="container text-center">
                <h1>SinglePlayer</h1>
                { this.displayButton() }
                { this.displayResult() }
                { this.displayBoard() }
            </div>
        );
    }
}
 
export default SinglePlayer;