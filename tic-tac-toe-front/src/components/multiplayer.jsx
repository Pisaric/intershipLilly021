import React, { Component } from "react";
import TicTacToeBoard from "./board";

class Multiplayer extends Component {
    state = {  } 
    render() { 
        return (
            <React.Fragment>
                <h1>Multi player</h1>
                <button>New game</button>
                <TicTacToeBoard />
            </React.Fragment>
        );
    }
}
 
export default Multiplayer;