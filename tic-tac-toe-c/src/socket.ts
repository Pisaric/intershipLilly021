import { io, Socket } from 'socket.io-client';
import { getCurrentUser } from "./service/authService";

let socket: Socket | null = null;
let joined = false;

export function connection(url: string) {
	if (socket?.connected) {
        console.log('Veza je već uspostavljena.');
        return;
    } else {
        socket = io(url);
        socket.connect();
        // localStorage.setItem('socket', socket?.id);
    }

	socket.on('connect', () => {
		if (socket?.connected) {
			console.log('Veza je već uspostavljena.');
			return;
		}
		console.log(socket?.id);
		// if(localStorage.getItem('socket') !== null) return;
		// if(socket !== null) return;
		if(socket?.id === undefined) return;
		localStorage.setItem('socket', socket?.id);
	});
}

export function joinServer() {
	if (joined) return;
	socket?.emit('join server', getCurrentUser().username, getCurrentUser()._id);
	joined = true;
  
}

export function getSocket(): Socket | null {
  	return socket;
}

export function reconnect(id: string) {
	socket = io('http://localhost:3000', { query: { id } });
	socket.id = id;
}
