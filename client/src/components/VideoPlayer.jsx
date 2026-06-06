import { useEffect, useRef, useState } from 'react';

export default function VideoPlayer({ stream, muted = false, label, isLocal = false }) {
  const videoRef = useRef(null);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      setIsVideoOff(!videoTrack.enabled);
      const interval = setInterval(() => {
        setIsVideoOff(!videoTrack.enabled);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [stream]);

  return (
    <div className="video-card">
      {isVideoOff ? (
        <div className="video-off-placeholder">
          <div className="avatar-circle">
            {label?.charAt(0).toUpperCase() || '?'}
          </div>
          <p className="video-off-text">Camera Off</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          playsInline
          className={`video-element ${isLocal ? 'mirror' : ''}`}
        />
      )}
      <div className="video-label">
        <span className="label-dot" />
        {label}
        {isLocal && <span className="you-badge">YOU</span>}
      </div>
    </div>
  );
}