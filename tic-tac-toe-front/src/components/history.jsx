import React, { Component } from "react";
import http from "../services/httpService"
import { getCurrentUser } from "../services/authService";

const apiEndpoint = "http://localhost:3000/api/";


class History extends Component {
    state = { 
        games: null
    };

    async componentDidMount() {
        let { games } = this.state;
        const playerId = getCurrentUser()._id;
        console.log(playerId);
        await http.get(apiEndpoint + "games/allForUser", {
            params: { playerId }})
            .then(res => {
                games = res.data;
                this.setState({ games });
            });
    }

    displayResult = (game) => {
        if(game.winner !== null) return game.winner;
        return "Draw";
    }

    displayList = () => {
        const { games } = this.state;
        if(games === null) return <p>You haven't played a single game.</p>
        return (
            <div className="container">
                <h1>Game Boards List</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>X Player</th>
                            <th>O Player</th>
                            <th>Result</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                    {games.map((item) => (
                        <tr key={item._id}>
                            <td>{ item.xPlayer.username }</td>
                            <td>{ item.oPlayer === null ? "Bot" : item.oPlayer.username}</td>
                            <td>{ this.displayResult(item) }</td>
                            <td>{ item.type }</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    render() { 
        
        return (
            <React.Fragment>
                { this.displayList() }
            </React.Fragment>
        );
    }
}
 
export default History;