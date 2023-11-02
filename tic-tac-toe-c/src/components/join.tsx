import React, { Component } from "react";
import { getCurrentUser } from "../service/authService";
import http from "../service/httpService";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connection, joinServer, getSocket } from "../socket";
import { IGame } from "../model/game";
import { IUser } from "../model/user";

interface GameState {
  games: IGame[] | null;
  selectedGame: IGame | null;
}

export interface GameDto {
	board: object,
	xPlayer: object,
	oPlayer: object,
	winner: null | 'X' | 'O',
	isDraw: boolean,
	result: object,
	type: 'multiplayer' | 'singleplayer'
}

const apiEndpoint = "http://localhost:3000/api/";

class JoinInGame extends Component<RouteComponentProps, GameState> {
	state: GameState = {
		games: [],
		selectedGame: null,
	};

	constructor(props: RouteComponentProps) {
		super(props);
		connection('http://localhost:3000');
		joinServer();
	}

	async componentDidMount() {
		let { games } = this.state;
		const playerId = getCurrentUser()?._id;
		await http.get(apiEndpoint + "games/join/" + playerId)
			.then((res) => {
				games = res.data;
				this.setState({ games });
			})
			.catch((ex) => {
				console.error(ex);
			});
		await this.listenNewGame();
	}

	listenNewGame = async () => {
		let { games } = this.state;
		getSocket()?.on('newgame', async (newGame: IGame) => {
			if(games === null || newGame === null) return;
			const playerId = getCurrentUser()?._id;
			await http.get(apiEndpoint + "games/join/" + playerId)
			.then((res) => {
				games = res.data;
				this.setState({ games });
			})
			.catch((ex) => {
				console.error(ex);
			});
		});
	}

	handlerJoin = async (game: IGame) => {
		const oPlayer = getCurrentUser()?._id;
		await http.put(apiEndpoint + "games/join/" + game._id, {oPlayer }, {
			headers: {
			'x-auth-token': localStorage.getItem('token')
			}
		})
		.then(res => {
			this.state.selectedGame = res.data;
			if(this.state.selectedGame === null) return;
			localStorage.setItem('game', this.state.selectedGame._id);
			this.props.history.push('/multiplayer');					//zbog ovoga se desi promena socketa
		})
		.catch(ex => {
			console.error(ex);
		});    
	}

	displayUsername = (xPlayer: IUser | string) => {
		if(typeof xPlayer === 'string') return xPlayer;
		return xPlayer.username;	
	}

	displayList = () => {
		const { games } = this.state;
		if (!games || games.length === 0) {
			return <p>There is no game you can join</p>;
		}
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
						<td>{ this.displayUsername(item.xPlayer) }</td>
						<td>
						<button onClick={() => this.handlerJoin(item)}>Join</button>
						</td>
					</tr>
					))}
				</tbody>
				</table>
			</div>
		);
	}

  render() {
    return (
		<div className="container text-center">
			<h1>Join</h1>
			{this.displayList()}
      	</div>
    );
  }
}

export default withRouter(JoinInGame);
