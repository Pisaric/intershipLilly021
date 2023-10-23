import React, { Component } from "react";
import { getCurrentUser } from "../services/authService";
import http from "../services/httpService";

const apiEndpoint = "http://localhost:3000/api/";

class Multiplayer extends Component {
    state = { 
        game: null,
        board: null
    } 

    async componentDidMount() {
        
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
            board = response.data.board;
            this.setState({ board, game });
        });        
    }

    handleClick = (row, col) => {

    }
   
    displayBoard = () => {
        const {game, board} = this.state;
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