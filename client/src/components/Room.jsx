import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebRTC from '../hooks/useWebRTC';
import VideoPlayer from './VideoPlayer';
import Controls from './Controls';
import socket from '../socket';

export default function Room({ roomId }) {
  const { localStream, peers } = useWebRTC(roomId);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const screenTrackRef = useRef(null);
  const navigate = useNavigate();

  const toggleMic = () => {
    localStream?.getAudioTracks().forEach(t => (t.enabled = !t.enabled));
    setMicOn(prev => !prev);
  };

  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach(t => (t.enabled = !t.enabled));
    setCameraOn(prev => !prev);
  };

  const shareScreen = async () => {
    if (screenSharing) {
      screenTrackRef.current?.stop();
      setScreenSharing(false);
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenTrackRef.current = screenStream.getVideoTracks()[0];
      setScreenSharing(true);
      screenTrackRef.current.onended = () => setScreenSharing(false);
    } catch (err) {
      console.error('Screen share error:', err);
    }
  };

  const copyRoomId = () => {
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalParticipants = 1 + peers.length;

  return (
    <div className="room-page">
      {/* Header */}
      <header className="room-header">
        <div className="room-header-left">
          <div className="logo-small">📹 NexCall</div>
          <div className="room-badge">
            <span className="live-dot" />
            LIVE · {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="room-header-right">
          <button onClick={copyRoomId} className="copy-btn">
            {copied ? '✅ Link Copied!' : '🔗 Share Invite Link'}
          </button>
          <div className="room-id-chip">ID: {roomId.slice(0, 8)}...</div>
        </div>
      </header>

      {/* Video Grid */}
      <main className="video-grid" data-count={totalParticipants}>
        {localStream && (
          <VideoPlayer stream={localStream} muted={true} label="You" isLocal={true} />
        )}
        {peers.map(peer => (
          <VideoPlayer key={peer.id} stream={peer.stream} label={`Guest ${peer.id.slice(0, 4)}`} />
        ))}
        {peers.length === 0 && (
          <div className="waiting-card">
            <div className="waiting-animation">
              <span /><span /><span />
            </div>
            <p className="waiting-title">Waiting for others to join...</p>
            <p className="waiting-sub">Share the invite link to start the call</p>
            <button onClick={copyRoomId} className="copy-btn-big">
              {copied ? '✅ Copied!' : '🔗 Copy Invite Link'}
            </button>
          </div>
        )}
      </main>

      {/* Controls */}
      <footer className="room-footer">
        <Controls
          micOn={micOn}
          cameraOn={cameraOn}
          screenSharing={screenSharing}
          onToggleMic={toggleMic}
          onToggleCamera={toggleCamera}
          onShareScreen={shareScreen}
          onLeave={() => navigate('/')}
        />
      </footer>
    </div>
  );
}