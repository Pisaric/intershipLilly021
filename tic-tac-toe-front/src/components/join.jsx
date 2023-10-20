import React, { Component } from "react";

class JoinInGame extends Component {
    state = {
        games: ['game1', 'game2', 'game3']
    };

    handleDelete = game => {
        
    }

    renderGames() {
        if(this.state.games.length === 0) return null;
        return (
            null
        );
    }

    render() { 
        return (
            <React.Fragment>
                <h1>Join</h1>
                { this.renderGames() }
            </React.Fragment>
        );
    }
}
 
export default JoinInGame;