import React, { Component } from "react";
import { Route } from "react-router-dom";
import LoginForm from "./components/loginForm";
import Movies from "./components/movies";
import auth from './services/authService'
import jwtDecode from "jwt-decode";
import "./App.css";
import ProtectedRoute from "./components/protectedRoute";

class App extends Component {
  
  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  
  render() {
    return (
      <main className="container">
        <LoginForm/>
        <Movies />
        <ProtectedRoute />
      </main>
    );
  }
}

export default App;
