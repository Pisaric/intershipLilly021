import React, { Component } from "react";
import { getCurrentUser } from "../services/authService";
import http from "../services/httpService";
import { connection, joinServer, getSocket } from "../socket";

const apiEndpoint = "http://localhost:3000/api/";

class Multiplayer extends Component {
    state = { 
        game: null,
        board: null,
    } 

    constructor() {
        super();
        connection('http://localhost:3000');
        joinServer();
        
    }

    listenBoard =  () => {
        let { game } = this.state;
        getSocket().on('updatedBoard', async (newBoard) => {
            await http.get(apiEndpoint + 'games/multiplayer/' + localStorage.getItem('game')).then(res => {
                game = res.data;
            })
            game.board = newBoard;
            this.setState({ game });
        })
    }

    listenJoin = () => {
        let { game } = this.state;
        getSocket().on('joinedGame', (newGame) => {
            game = newGame;
            this.setState({ game });
        })
    }
   
    async componentDidMount() {
        if(localStorage.getItem('game') !== null) {
            let { game } = this.state;
            let _id = localStorage.getItem('game');
            await http.get(apiEndpoint + "games/multiplayer/" + _id).then(res => {
                game = res.data;
                this.setState({ game });
            }) 
        }  
        
        this.listenJoin();
        this.listenBoard();
    }

    handleCreate = async () => {
     
        let { game } = this.state;
        const xPlayer = getCurrentUser()._id;
        const type = "multiplayer"
        await http.post(apiEndpoint + "games", { xPlayer, type}, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        }).then(response =>  {
            game = response.data;
            localStorage.setItem('game', game._id);
            this.setState({ game });
        });       
        console.log(game); 
    }

    isValidMove = (game) => {
        if(game.board.currentPlayer === 'X' && game.xPlayer._id !== getCurrentUser()._id) {
            return false;
        }
        else if(game.board.currentPlayer === 'O' && game.oPlayer._id !== getCurrentUser()._id) {
            return false;
        }
        return true;
    }

    handleClick = async (row, col) => {
        let { game } = this.state;

        if(!this.isValidMove(game)) {
            alert('This is not your turn');
            return;
        }

        if(game.board.winner !== null || game.board.isDraw) {
            alert('Game is over');
            return;
        }
        if(game.board === null || game.board.board[row][col] !== null) {
            alert('Invalid move');
            return;
        }

        const gameId = localStorage.getItem('game')
        await http.post(apiEndpoint + "moves/multiPlayer", {gameId, row, col}, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        }).then(res => {
            game.board = res.data;
            this.setState({ game });
        }).catch(ex => {
            console.error(ex);
        });

    }

    
    displayBoard = () => {
        let { game } = this.state;
        if(game === null) return null;
        return (
            <React.Fragment>
                <div className="row row-cols-3">
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 0, 0)}> { game.board.board[0][0] === null ? '' : game.board.board[0][0] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 0, 1)}> { game.board.board[0][1] === null ? '' : game.board.board[0][1] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 0, 2)}> { game.board.board[0][2] === null ? '' : game.board.board[0][2] } </div>
                </div>
                <div className="row row-cols-3">
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 1, 0)}> { game.board.board[1][0] === null ? '' : game.board.board[1][0] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 1, 1)}> { game.board.board[1][1] === null ? '' : game.board.board[1][1] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 1, 2)}> { game.board.board[1][2] === null ? '' : game.board.board[1][2] } </div>
                </div>
                <div className="row row-cols-3">
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 2, 0)}> { game.board.board[2][0] === null ? '' : game.board.board[2][0] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 2, 1)}> { game.board.board[2][1] === null ? '' : game.board.board[2][1] } </div>
                    <div className="col border cell text-center" onClick={this.handleClick.bind(this, 2, 2)}> { game.board.board[2][2] === null ? '' : game.board.board[2][2] } </div>
                </div>
            </React.Fragment> 
        );
    }

    displayButton = () => {
        const { game } = this.state;
        if(game === null) {
            return <button onClick={this.handleCreate.bind(this)}>New game</button>;
        } else if(game.board.isDraw || game.board.winner !== null) {
            localStorage.removeItem('game');
            return <button onClick={this.handleCreate.bind(this)}>New game</button>;
        }
    }

    displayResult = () => {
        const { game } = this.state;
        if(game === null) return null;
        if(game.board.isDraw) {
            return <h2>DRAW</h2>
        } else if(game.board.winner === 'X') {
            return <h2> Winer is X </h2>
        } else if(game.board.winner === 'O') {
            return <h2>Winer is O</h2>
        }
    }

    render() { 
        return (
            <div  className="container text-center">
                <h1>Multi player</h1>
                { this.displayButton() }
                { this.displayResult() }
                { this.displayBoard() }
            </div>
        );
    }
}
 
export default Multiplayer;