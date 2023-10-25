import React, { Component } from "react";
import { getCurrentUser } from "../services/authService";
import http from "../services/httpService";
//import { io } from 'socket.io-client';
import { connection, joinServer, getSocket } from "../socket";
//import { connection, joinServer } from "../socket";

const apiEndpoint = "http://localhost:3000/api/";

class Multiplayer extends Component {
    state = { 
        game: null,
        board: null,
    } 



    constructor() {
        super();
        /*if(localStorage.getItem('socket') === null) {
             console.log('u ifu');
            this.state.socket = io('http://localhost:3000');
            console.log(this.state.socket);
            console.log(this.state.socket.socket.id);
            console.log('kraj ifa');
            localStorage.setItem('socket', this.state.socket.id); 
        } else {
            const socketId = localStorage.getItem('socket');
            this.state.socket = findSocket(socketId);
        }*/
        connection('http://localhost:3000');
        joinServer();
    }

    listenBoard = () => {
        let { board } = this.state;
        getSocket().on('updatedBoard', (newBoard) => {
            board = newBoard;
            this.setState({ board });
        })
    }
   
    async componentDidMount() {
        this.listenBoard();
        if(localStorage.getItem('game') !== null) {
            let { game, board } = this.state;
            let _id = localStorage.getItem('game');
            await http.get(apiEndpoint + "games/multiplayer/" + _id).then(res => {
                game = res.data;
                board = game.board;
                this.setState({ game, board });
            }) 
        }    
    }

    handleCreate = async () => {
        /*
        let { game } = this.state;
        const _id = getCurrentUser()._id;
        http.get(apiEndpoint + 'games/multiplayer', { params: localStorage.getItem('game') })
            .then(res => {
                game = res.body;
                this.setState({ game });
            })
            .cathc(ex => {

            });
        */
        let { game, board } = this.state;
        const xPlayer = getCurrentUser()._id;
        const type = "multiplayer"
        await http.post(apiEndpoint + "games", { xPlayer, type}, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        }).then(response =>  {
            game = response.data;
            localStorage.setItem('game', game._id);
            board = response.data.board;
            this.setState({ board, game });
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
        let { game, board } = this.state;
        if(game.oPlayer === null) {
            await http.get('games/multiplayer/' + game._id).then(res => {
                game = res.data;
            });
        }
        console.log(game);
        if(board.currentUser === 'X' && game.xPlayer._id !== getCurrentUser()._id) {
            alert('This is not your turn');
            return;
        }
        else if(board.currentUser === 'O' && game.oPlayer._id !== getCurrentUser()._id) {
            alert('This is not your turn');
            return;
        }
        if(board.winner !== null || board.isDraw) return;
        const gameId = localStorage.getItem('game')
        if(board === null || board.board[row][col] !== null) return;
        await http.post(apiEndpoint + "moves/multiPlayer", {gameId, row, col}, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        }).then(res => {
            board = res.data;
            this.setState({ board });
        }).catch(ex => {
            console.error(ex);
        });
        if(board.winner === null && !board.isDraw) {
            //await this.botMove();
        }
        this.displayResult();
    }

    
    displayBoard = () => {
        let {game, board} = this.state;
        if(game === null) return <button onClick={this.handleCreate.bind(this)}>New game</button>;
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

    render() { 
        return (
            <React.Fragment>
                <h1>Multi player</h1>
                { this.displayBoard() }
            </React.Fragment>
        );
    }
}
 
export default Multiplayer;