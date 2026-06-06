import { io } from 'socket.io-client';

// Directly set your Render server URL here
const SERVER_URL = 'https://nexcall-server-enl1.onrender.com';

const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => console.log('✅ Connected to signaling server'));
socket.on('disconnect', () => console.log('❌ Disconnected from server'));

export default socket;