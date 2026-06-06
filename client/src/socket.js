import { io } from 'socket.io-client';

// Uses environment variable for production, falls back to localhost for development
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => console.log('✅ Connected to signaling server'));
socket.on('disconnect', () => console.log('❌ Disconnected from server'));

export default socket;