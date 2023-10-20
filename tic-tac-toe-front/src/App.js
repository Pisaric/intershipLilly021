import React, { Component } from "react";
import {BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import auth from './services/authService'
import jwtDecode from "jwt-decode";
//import ProtectedRoute from "./components/protectedRoute";
import LoginForm from './components/loginForm';
import Nav from "./components/nav";
import SinglePlayer from "./components/singleplayer";
import Multiplayer from "./components/multiplayer";
import History from "./components/history";
import JoinInGame from './components/join';
import RegiserForm from "./components/register";

class App extends Component {
  state = { 
    user: null
  };

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
    const { user } = this.state;

    return (
      <React.Fragment>
        {this.displayLogin() }
      </React.Fragment>
    );
  }
}


export default App;

/*
Log in i Sign up
Prikaz samo login na pocetku
Nakon logovanja nav bar na multiplayer 

*/