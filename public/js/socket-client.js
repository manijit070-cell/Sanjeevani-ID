// Sanjeevani-ID: Real-time Socket.io Client Engine

let socket = null;

function initSocketConnection() {
  if (typeof io !== 'undefined') {
    socket = io({
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Sanjeevani-ID Real-Time Gateway, ID:', socket.id);
      updateNetworkBadge(true);
    });

    socket.on('disconnect', () => {
      console.warn('⚠️ Disconnected from Sanjeevani-ID Gateway');
      updateNetworkBadge(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      updateNetworkBadge(false);
    });
  } else {
    console.warn('Socket.io library not loaded, running in offline/polling mode.');
  }
  return socket;
}

function updateNetworkBadge(connected) {
  const badge = document.getElementById('network-status-badge');
  if (badge) {
    if (connected) {
      badge.innerHTML = `<span class="pulse-dot green"></span> <span style="color:#34D399;">GATEWAY ACTIVE</span>`;
    } else {
      badge.innerHTML = `<span class="pulse-dot amber"></span> <span style="color:#FBBF24;">CONNECTING...</span>`;
    }
  }
}

// Global Toast Messenger
function showToast(message, type = 'cyan', durationMs = 4500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = '🔔';
  if (type === 'danger') icon = '🚨';
  if (type === 'success') icon = '✅';
  if (type === 'cyan') icon = '⚡';

  toast.innerHTML = `
    <span style="font-size: 1.25rem;">${icon}</span>
    <div style="flex:1;">
      <div style="font-size: 0.88rem; font-weight: 600;">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  if (window.SoundSystem) {
    if (type === 'danger') SoundSystem.playAlertBeep();
    else if (type === 'success') SoundSystem.playSuccessChime();
    else SoundSystem.playClick();
  }

  setTimeout(() => {
    toast.style.transition = 'all 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, durationMs);
}

window.initSocketConnection = initSocketConnection;
window.showToast = showToast;
