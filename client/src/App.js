import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Room from './components/Room';
import './App.css';

function Home() {
  const [roomId, setRoomId] = useState('');
  const [hovering, setHovering] = useState(false);
  const navigate = useNavigate();

  const createRoom = () => navigate(`/room/${uuidv4()}`);
  const joinRoom = () => roomId.trim() && navigate(`/room/${roomId.trim()}`);

  return (
    <div className="home-page">
      {/* Animated background */}
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Grid overlay */}
      <div className="grid-overlay" />

      {/* Nav */}
      <nav className="home-nav">
        <div className="nav-logo">
          <span className="nav-logo-icon">📹</span>
          <span className="nav-logo-text">NexCall</span>
        </div>
        <div className="nav-links">
          <span className="nav-badge">Free · No sign-up · No download</span>
        </div>
      </nav>

      {/* Hero */}
      <main className="hero">
        <div className="hero-tag">
          <span className="tag-dot" />
          WebRTC Powered · End-to-End Encrypted
        </div>

        <h1 className="hero-title">
          Video calls that
          <br />
          <span className="hero-gradient">just work.</span>
        </h1>

        <p className="hero-sub">
          No accounts. No downloads. Just share a link and connect
          <br />with anyone, anywhere in the world — instantly.
        </p>

        {/* Action Cards */}
        <div className="action-cards">
          {/* Create Room */}
          <div
            className={`action-card action-card-primary ${hovering ? 'hovered' : ''}`}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <div className="card-icon-wrap">✨</div>
            <h3 className="card-title">Create a Room</h3>
            <p className="card-desc">Start a new call instantly. Get a shareable link in seconds.</p>
            <button onClick={createRoom} className="btn-primary">
              Start New Call
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Divider */}
          <div className="card-divider">
            <span>or</span>
          </div>

          {/* Join Room */}
          <div className="action-card action-card-secondary">
            <div className="card-icon-wrap">🔗</div>
            <h3 className="card-title">Join a Room</h3>
            <p className="card-desc">Have a Room ID or link? Paste it below and jump in.</p>
            <div className="join-input-group">
              <input
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && joinRoom()}
                placeholder="Paste Room ID or link..."
                className="join-input"
              />
              <button onClick={joinRoom} className="btn-secondary">
                Join →
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="features">
          {[
            { icon: '🔒', label: 'Private & Secure' },
            { icon: '⚡', label: 'Ultra Low Latency' },
            { icon: '🌍', label: 'Works Everywhere' },
            { icon: '📱', label: 'Any Device' },
          ].map(f => (
            <div key={f.label} className="feature-chip">
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        Built with WebRTC · Socket.IO · React
      </footer>
    </div>
  );
}

function RoomWrapper() {
  const { roomId } = useParams();
  return <Room roomId={roomId} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<RoomWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}