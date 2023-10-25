import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import auth from './services/authService'
import LoginForm from './components/loginForm';
import Nav from "./components/nav";
import SinglePlayer from "./components/singleplayer";
import Multiplayer from "./components/multiplayer";
import History from "./components/history";
import JoinInGame from './components/join';


class App extends Component {
  state = { 
    user: null,
    //socket: ''
  };

  sendMessage = () => {
    this.socket.emit('message', 'Hey it worked');
  }


  componentDidMount() {
    let { user } = this.state;
    user = auth.getCurrentUser();
    this.setState({ user });
   
  }
  
 

  displayLogin = () => {
    return this.state.user === null ? <LoginForm /> : (<div>
                                                        <Nav />
                                                        <div className="container">
                                                            <Switch>
                                                                <Route path="/" exact component={SinglePlayer} />
                                                                <Route path="/multiplayer" component={Multiplayer} />
                                                                <Route path="/join" component={JoinInGame} /> 
                                                                <Route path="/history" component={History} /> 
                                                            </Switch> 
                                                        </div>
                                                      </div>);
  }



  render() {

    return (
      <React.Fragment>
        
        {this.displayLogin() }
      </React.Fragment>
    );
  }
}


export default App;

