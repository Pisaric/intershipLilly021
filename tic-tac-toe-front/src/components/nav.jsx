import React from "react";
import { Link } from "react-router-dom";
import { logout} from "../services/authService";



const Nav = () => {


    return (
        <div className="container text-center">
            <nav className="nav">
                <Link className="nav-link" to="/" >Singleplayer</Link>
                <Link className="nav-link" to="/multiplayer" >Multiplayer</Link>
                <Link className="nav-link active" to="/join" >Join</Link>
                <Link className="nav-link active" to="/history" >History</Link>
                <Link className="nav-link active" to="/" onClick={() => logout()} >Logout</Link>
            </nav>
        </div>
    );
};

export default Nav;
