import jwtDecode from "jwt-decode";
import http from "./httpService";
import { getSocket } from "../socket";

const apiEndpoint = "http://localhost:3000/api/auth";
const tokenKey = "token";

export async function login(email, password) {
    const { data: jwt } = await http.post(apiEndpoint, { email, password});
    localStorage.setItem(tokenKey, jwt);
}

export function loginWihtJWT(jwt) {
    localStorage.setItem(tokenKey, jwt);
}

export function logout() {
   // getSocket().emit("log out", getCurrentUser()._id);
   // localStorage.removeItem('socket');
    localStorage.removeItem(tokenKey);
    window.location.reload(false);
}

export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        return jwtDecode(jwt);
    } catch (ex) {
        return null;    
    }
}

export default {
    login,
    loginWihtJWT,
    logout,
    getCurrentUser
}

