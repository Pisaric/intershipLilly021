import React, { Component } from "react";
import http from "../service/httpService";
import { getCurrentUser } from "../service/authService";
import { IGame } from "../model/game";
import { IUser } from "../model/user";

const apiEndpoint = "http://localhost:3000/api/";

interface GameState {
  games: IGame[] | null; 
}

class History extends Component<{}, GameState> {
	state: GameState = {
		games: []
	};

	async componentDidMount() {
		let { games } = this.state;
			const playerId = getCurrentUser()._id;
			await http.get(apiEndpoint + "games/allForUser/" + playerId)
				.then(res => {
					games = res.data;
					this.setState({ games });
				})
				.catch(ex => {
					console.error(ex);
				});
  	}

	displayResult = (game: any) => {
		if (game.winner !== null) return game.winner;
		return "Draw";
	};

	displayUsername = (xPlayer: IUser | string) => {
		if(typeof xPlayer === 'string') return xPlayer;
		return xPlayer.username;	
	}

	displayList = () => {
		const { games } = this.state;
		if (games === null) return <p>You haven't played a single game.</p>;
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
					<td>{ this.displayUsername(item.xPlayer) }</td>
					<td>
						{ item.oPlayer === null ? "Bot" : this.displayUsername(item.oPlayer) }
					</td>
					<td>{this.displayResult(item)}</td>
					<td>{item.type}</td>
				</tr>
				))}
			</tbody>
			</table>
		</div>
		);
	};

  render() {
    return (
		<div className="container text-center">
        	{this.displayList()}
		</div>
    );
  }
}

export default History;
