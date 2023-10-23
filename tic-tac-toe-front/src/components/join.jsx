import React, { Component } from "react";
import { getCurrentUser } from "../services/authService";
import http from "../services/httpService";
// eslint-disable-next-line
import { withRouter } from 'react-router-dom';

const apiEndpoint = "http://localhost:3000/api/";

class JoinInGame extends Component {
    state = { 
        games: null,
        selectedGame: null
    };

    componentDidMount() {
        let { games } = this.state;
        const playerId = getCurrentUser()._id;
        http.get(apiEndpoint + "games/join/" + playerId)
            .then(res => {
                games = res.data;
                this.setState({ games });
            })
            .catch(ex => {

            });
    }

    handlerJoin = async (game) => {
        const oPlayer = getCurrentUser()._id;
        await http.put(apiEndpoint + "games/join/" + game._id, {oPlayer }, {
                headers: {
                  'x-auth-token': localStorage.getItem('token')
                }
            })
            .then(res => {
                this.state.selectedGame = res.data;
                console.log(this.state.selectedGame);
                localStorage.setItem('game', this.state.selectedGame._id);
                this.props.history.push('/multiplayer');
            })
            .catch(ex => {

            });     
    }

    displayList = () => {
        const { games } = this.state;
        if(games === null || games.length === 0) return <p>There is no game you can join</p>;
        return (
            <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>X Player</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                    {games.map((item) => (
                        <tr key={item._id}>
                            <td>{ item.xPlayer.username }</td>
                            <td> <button onClick={this.handlerJoin.bind(this, item)}> Join </button> </td>
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
                <h1>Join</h1>
                { this.displayList() }
            </React.Fragment>
        );
    }
}
 
export default JoinInGame;