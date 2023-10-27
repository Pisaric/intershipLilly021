import { io } from 'socket.io-client';
import { getCurrentUser } from "./services/authService";

let socket = null;
let joined = false;

export function connection(url) {
  if(socket !== null) return;
  socket = io.connect(url);
  console.log(socket.id); 
  socket.on('connect', () => {
      console.log(socket.id); 
      localStorage.setItem('socket', socket.id);
  });
} 


export function joinServer() {
  if(joined) return;
  socket.emit('join server', getCurrentUser().username, getCurrentUser()._id);
  joined = true;
}

export function getSocket() {
  return socket;
}

export function recconect(id) {
  socket = io('http://localhost:3000');
  socket.id = id;
  console.log(socket);
}
