// Sanjeevani-ID: Patient Emergency Pass & Lock Screen Wallpaper Logic

let currentPatientId = 'ROHAN-101';
let currentWallpaperStyle = 'neon';

const wallpapers = {
  neon: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 50%, #020617 100%)',
  ocean: 'linear-gradient(135deg, #0C4A6E 0%, #082F49 50%, #020617 100%)',
  midnight: 'linear-gradient(135deg, #18181B 0%, #09090B 50%, #000000 100%)',
  emergency: 'linear-gradient(135deg, #7F1D1D 0%, #450A0A 50%, #020617 100%)'
};

document.addEventListener('DOMContentLoaded', () => {
  initSocketConnection();
  startClock();
  selectPatient('ROHAN-101');
});

function startClock() {
  function updateTime() {
    const now = new Date();
    const timeEl = document.getElementById('lock-time');
    const dateEl = document.getElementById('lock-date');
    if (timeEl) {
      timeEl.innerText = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    if (dateEl) {
      dateEl.innerText = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    }
  }
  updateTime();
  setInterval(updateTime, 1000);
}

function selectPatient(patientId) {
  currentPatientId = patientId;

  const btnRohan = document.getElementById('btn-patient-rohan');
  const btnPriya = document.getElementById('btn-patient-priya');

  if (patientId === 'ROHAN-101') {
    btnRohan.className = 'btn btn-primary';
    btnPriya.className = 'btn btn-outline';

    document.getElementById('phone-patient-name').innerText = 'Rohan Verma';
    document.getElementById('phone-patient-vehicle').innerText = 'PB-10-AB-1234 • Royal Enfield 350 • Ludhiana';
    const badge = document.getElementById('phone-blood-badge');
    badge.innerText = 'O- NEGATIVE';
    badge.className = 'badge badge-red';
  } else {
    btnRohan.className = 'btn btn-outline';
    btnPriya.className = 'btn btn-primary';

    document.getElementById('phone-patient-name').innerText = 'Priya Nair';
    document.getElementById('phone-patient-vehicle').innerText = 'DL-01-XY-9081 • Hyundai Creta • New Delhi';
    const badge = document.getElementById('phone-blood-badge');
    badge.innerText = 'B+ POSITIVE';
    badge.className = 'badge badge-cyan';
  }

  // Update direct link
  const scanLink = document.getElementById('direct-scan-link');
  const targetUrl = `${window.location.origin}/er-dashboard.html?patientId=${patientId}`;
  scanLink.href = targetUrl;

  // Render QR Code Image
  const qrImg = document.getElementById('qr-image');
  if (qrImg) {
    qrImg.src = `/api/qr?text=${encodeURIComponent(targetUrl)}`;
  }

  if (window.SoundSystem) SoundSystem.playClick();
}

function setWallpaper(style) {
  currentWallpaperStyle = style;
  const el = document.getElementById('wallpaper-bg-preview');
  if (el && wallpapers[style]) {
    el.style.backgroundImage = wallpapers[style];
  }
  if (window.SoundSystem) SoundSystem.playClick();
}

async function simulateCrashArrival() {
  if (window.SoundSystem) SoundSystem.playAlertBeep();
  showToast('🚨 Highway Crash Simulated! Emitting ER arrival to Apollo Hospital Ludhiana...', 'danger');

  try {
    const res = await fetch('/api/er/initiate-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: currentPatientId,
        hospitalName: "Apollo Hospital Ludhiana (Trauma Level-1)",
        gpsLocation: "30.9010° N, 75.8573° E"
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast('📡 Emergency alert broadcasted to Family Guardian & Doctor HUD!', 'success');
    }
  } catch (err) {
    console.error('Error simulating crash:', err);
  }
}

function copyDirectLink() {
  const targetUrl = `${window.location.origin}/er-dashboard.html?patientId=${currentPatientId}`;
  navigator.clipboard.writeText(targetUrl).then(() => {
    showToast('📋 Emergency ER URL copied to clipboard!', 'cyan');
  }).catch(() => {
    showToast('Emergency URL: ' + targetUrl, 'cyan');
  });
}

// Downloadable High-Res Lock Screen Wallpaper Generator via HTML5 Canvas
function downloadLockScreenWallpaper() {
  const width = 1080;
  const height = 2400; // 9:20 modern mobile aspect ratio

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Draw Wallpaper Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  if (currentWallpaperStyle === 'ocean') {
    grad.addColorStop(0, '#0C4A6E');
    grad.addColorStop(0.5, '#082F49');
    grad.addColorStop(1, '#020617');
  } else if (currentWallpaperStyle === 'midnight') {
    grad.addColorStop(0, '#18181B');
    grad.addColorStop(0.5, '#09090B');
    grad.addColorStop(1, '#000000');
  } else if (currentWallpaperStyle === 'emergency') {
    grad.addColorStop(0, '#7F1D1D');
    grad.addColorStop(0.5, '#450A0A');
    grad.addColorStop(1, '#020617');
  } else {
    // Neon
    grad.addColorStop(0, '#1E1B4B');
    grad.addColorStop(0.5, '#0F172A');
    grad.addColorStop(1, '#020617');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Lock Screen Time Text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.font = '300 180px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('12:45', width / 2, 450);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = '500 52px sans-serif';
  ctx.fillText('Monday, 26 October', width / 2, 540);

  // 3. Draw Glassmorphic Pass Card Background
  const cardX = 100;
  const cardY = 700;
  const cardW = width - 200;
  const cardH = 1200;
  const radius = 48;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, radius);
  ctx.fill();
  ctx.stroke();

  // 4. Card Header
  ctx.fillStyle = '#06B6D4';
  ctx.font = '800 48px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🛡️ SANJEEVANI-ID EMERGENCY PASS', cardX + 60, cardY + 110);

  // Blood Group Badge
  const blood = currentPatientId === 'ROHAN-101' ? 'O- NEGATIVE' : 'B+ POSITIVE';
  ctx.fillStyle = currentPatientId === 'ROHAN-101' ? '#EF4444' : '#06B6D4';
  ctx.font = '800 44px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(blood, cardX + cardW - 60, cardY + 110);

  // 5. Draw QR Code into Canvas Center
  const qrImg = document.getElementById('qr-image');
  if (qrImg && qrImg.complete && qrImg.naturalWidth > 0) {
    const qrSize = 480;
    const qrX = width / 2 - qrSize / 2;
    const qrY = cardY + 200;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48, 24);
    ctx.fill();

    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
  }

  // 6. Patient Details & Instructions
  const name = currentPatientId === 'ROHAN-101' ? 'Rohan Verma' : 'Priya Nair';
  const vehicle = currentPatientId === 'ROHAN-101' ? 'PB-10-AB-1234 • Ludhiana' : 'DL-01-XY-9081 • New Delhi';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 68px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, width / 2, cardY + 800);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 44px sans-serif';
  ctx.fillText(vehicle, width / 2, cardY + 870);

  // Red Emergency Box
  ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(cardX + 60, cardY + 930, cardW - 120, 160, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FCA5A5';
  ctx.font = '700 38px sans-serif';
  ctx.fillText('FOR 108 AMBULANCE / HOSPITAL ER TRAUMA DESK', width / 2, cardY + 995);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 36px sans-serif';
  ctx.fillText('Scan QR code with any camera to unlock emergency triage records', width / 2, cardY + 1050);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `Sanjeevani_Emergency_LockScreen_${name.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  showToast('📥 Wallpaper downloaded! Set as phone lock screen.', 'success');
}
