import { useEffect, useRef, useState, useCallback } from 'react';
import socket from '../socket';

// Free public STUN + TURN servers for universal internet calling
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
};

export default function useWebRTC(roomId) {
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const [peers, setPeers] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const createPeerConnection = useCallback((peerId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    localStreamRef.current.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current);
    });

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setPeers(prev => {
        if (prev.find(p => p.id === peerId)) return prev;
        return [...prev, { id: peerId, stream: remoteStream }];
      });
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { to: peerId, candidate: event.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      setConnectionStatus(pc.connectionState);
    };

    peerConnectionsRef.current[peerId] = pc;
    return pc;
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        setLocalStream(stream);
        setConnectionStatus('ready');
        socket.emit('join-room', roomId);
      })
      .catch(err => {
        console.error('Camera/mic error:', err);
        setConnectionStatus('error');
      });

    socket.on('existing-users', async (userIds) => {
      for (const userId of userIds) {
        const pc = createPeerConnection(userId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { to: userId, offer });
      }
    });

    socket.on('user-joined', (userId) => {
      createPeerConnection(userId);
    });

    socket.on('offer', async ({ from, offer }) => {
      let pc = peerConnectionsRef.current[from] || createPeerConnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { to: from, answer });
    });

    socket.on('answer', async ({ from, answer }) => {
      const pc = peerConnectionsRef.current[from];
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async ({ from, candidate }) => {
      const pc = peerConnectionsRef.current[from];
      if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('user-left', (userId) => {
      if (peerConnectionsRef.current[userId]) {
        peerConnectionsRef.current[userId].close();
        delete peerConnectionsRef.current[userId];
      }
      setPeers(prev => prev.filter(p => p.id !== userId));
    });

    return () => {
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
      socket.removeAllListeners();
    };
  }, [roomId, createPeerConnection]);

  return { localStream, peers, connectionStatus };
}