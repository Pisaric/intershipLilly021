import { jwtDecode } from "jwt-decode";
import http from "./httpService";

const apiEndpoint = "http://localhost:3000/api/auth";
const tokenKey = "token";

export async function login(email: string, password: string): Promise<void> {
    const { data: jwt } = await http.post(apiEndpoint, { email, password });
    localStorage.setItem(tokenKey, jwt);
}

export function loginWithJWT(jwt: string): void {
    localStorage.setItem(tokenKey, jwt);
}

export function logout(): void {
    localStorage.removeItem(tokenKey);
    if(localStorage.getItem('game') !== null) localStorage.removeItem('game');
    window.location.reload();               
}

export function getCurrentUser(): any {
    try {
        const jwt = localStorage.getItem(tokenKey);
        return jwt ? jwtDecode(jwt) : null;
    } catch (ex) {
        return null;
    }
}

export default {
    login,
    loginWithJWT,
    logout,
    getCurrentUser,
};
