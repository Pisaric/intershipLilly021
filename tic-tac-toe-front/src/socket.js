import { io } from 'socket.io-client';
import { getCurrentUser } from "./services/authService";

let socket = null;
let joined = false;

export function connection(url) {
  if(socket !== null) return;
  socket = io(url);
} 

export function joinServer() {
  if(joined) return;
  socket.emit('join server', getCurrentUser().username, getCurrentUser()._id);
  joined = true;
}

export function getSocket() {
  return socket;
}

/* let sockets = []

function addSocket(socket) {
  sockets.push(socket);
  console.log(sockets);
}

function findSocket(id) {
  for(let i = 0;  i < sockets.length; i++) {
    if(sockets[i].id === id) { 
      return sockets[i];
    }
  }
}

module.exports.addSocket = addSocket;
module.exports.findSocket = findSocket; */


