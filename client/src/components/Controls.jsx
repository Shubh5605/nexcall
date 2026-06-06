export default function Controls({
  onToggleMic, onToggleCamera, onLeave,
  onShareScreen, micOn, cameraOn, screenSharing
}) {
  return (
    <div className="controls-bar">
      <button
        onClick={onToggleMic}
        className={`ctrl-btn ${micOn ? 'ctrl-btn-active' : 'ctrl-btn-muted'}`}
        title={micOn ? 'Mute microphone' : 'Unmute microphone'}
      >
        <span className="ctrl-icon">{micOn ? '🎤' : '🔇'}</span>
        <span className="ctrl-label">{micOn ? 'Mute' : 'Unmute'}</span>
      </button>

      <button
        onClick={onToggleCamera}
        className={`ctrl-btn ${cameraOn ? 'ctrl-btn-active' : 'ctrl-btn-muted'}`}
        title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
      >
        <span className="ctrl-icon">{cameraOn ? '📷' : '🚫'}</span>
        <span className="ctrl-label">{cameraOn ? 'Camera' : 'Cam Off'}</span>
      </button>

      <button
        onClick={onShareScreen}
        className={`ctrl-btn ${screenSharing ? 'ctrl-btn-screen' : 'ctrl-btn-active'}`}
        title="Share screen"
      >
        <span className="ctrl-icon">🖥️</span>
        <span className="ctrl-label">{screenSharing ? 'Stop Share' : 'Share'}</span>
      </button>

      <button
        onClick={onLeave}
        className="ctrl-btn ctrl-btn-leave"
        title="Leave call"
      >
        <span className="ctrl-icon">📴</span>
        <span className="ctrl-label">Leave</span>
      </button>
    </div>
  );
}