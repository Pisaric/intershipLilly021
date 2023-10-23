import http from "./httpService"
import { apiUrl } from "../config.json"
import register from './../registerServiceWorker';

const apiEndpoint = apiUrl + "/users"

export function register(user) {
    http.post(apiEndpoint)
}