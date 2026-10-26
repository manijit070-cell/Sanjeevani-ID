// Sanjeevani-ID: Remote Family Guardian Engine

let currentRelativeId = 'ROHAN-101';
let sigCanvas = null;
let sigCtx = null;
let isDrawing = false;
let hasSigned = false;

document.addEventListener('DOMContentLoaded', () => {
  initSocketConnection();
  setupSignatureCanvas();
  setupFamilySocketListeners();
  checkCurrentStatus();
});

let currentAuditData = null;

function setupFamilySocketListeners() {
  if (!window.socket) return;

  // Real-time dispatch from ER Doctor scanning patient
  window.socket.on('er-alert-triggered', (data) => {
    console.log('🚨 Incoming ER Alert:', data);
    handleIncomingAlert(data);
  });

  // Real-time dispatch when Doctor executes statutory emergency override
  window.socket.on('override-police-audit-logged', (data) => {
    console.log('🚨 Incoming Police Audit Override:', data);
    handleOverridePoliceAudit(data);
  });

  // Real-time reset
  window.socket.on('system-reset', () => {
    console.log('🔄 System reset received');
    const cCard = document.getElementById('consent-receipt-card');
    const pCard = document.getElementById('override-police-receipt-card');
    if (cCard) cCard.style.display = 'none';
    if (pCard) pCard.style.display = 'none';
    currentAuditData = null;
    showToast('Demo reset: Patient records locked to initial state', 'cyan');
  });
}

function handleIncomingAlert(data) {
  // 1. Physical Phone Vibration
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate([300, 200, 300, 200, 500]);
    } catch (e) {}
  }

  // 2. Audible Emergency Siren
  if (window.SoundSystem) {
    SoundSystem.playSiren(15);
  }

  // 3. Populate and Show Modal
  document.getElementById('modal-patient-name').innerText = data.patientName || "Rohan Verma";
  document.getElementById('modal-hospital-name').innerText = data.hospitalName || "Apollo Hospital Ludhiana (Trauma Level-1)";
  document.getElementById('modal-hospital-gps').innerText = `📍 ${data.gpsLocation || '30.9010° N, 75.8573° E'} (GPS Verified)`;
  document.getElementById('modal-timestamp').innerText = data.timestamp || new Date().toLocaleTimeString();
  document.getElementById('modal-blood-group').innerText = data.bloodGroup || 'O- Negative';

  const overlay = document.getElementById('emergency-modal-overlay');
  if (overlay) overlay.style.display = 'flex';

  showToast(`🚨 CRITICAL: ${data.hospitalName} is requesting Emergency Medical Release for ${data.patientName}!`, 'danger', 8000);
}

function triggerTestAlert() {
  handleIncomingAlert({
    patientId: currentRelativeId,
    patientName: currentRelativeId === 'ROHAN-101' ? 'Rohan Verma' : 'Priya Nair',
    hospitalName: 'Apollo Hospital Ludhiana (Trauma Center Level-1)',
    gpsLocation: '30.9010° N, 75.8573° E',
    timestamp: new Date().toLocaleTimeString(),
    bloodGroup: currentRelativeId === 'ROHAN-101' ? 'O- Negative' : 'B+ Positive'
  });
}

function switchRelative() {
  currentRelativeId = currentRelativeId === 'ROHAN-101' ? 'PRIYA-202' : 'ROHAN-101';
  const nameEl = document.getElementById('guardian-patient-name');
  const bloodEl = document.getElementById('guardian-blood-badge');

  if (currentRelativeId === 'ROHAN-101') {
    nameEl.innerText = 'Rohan Verma';
    bloodEl.innerText = 'O- NEGATIVE';
    bloodEl.className = 'badge badge-red';
  } else {
    nameEl.innerText = 'Priya Nair';
    bloodEl.innerText = 'B+ POSITIVE';
    bloodEl.className = 'badge badge-cyan';
  }
  showToast(`Switched relative monitor to ${nameEl.innerText}`, 'cyan');
}

// -------------------------------------------------------------
// Interactive Digital Signature Canvas (Touch + Mouse)
// -------------------------------------------------------------
function setupSignatureCanvas() {
  sigCanvas = document.getElementById('signature-canvas');
  if (!sigCanvas) return;
  sigCtx = sigCanvas.getContext('2d');

  sigCtx.strokeStyle = '#06B6D4';
  sigCtx.lineWidth = 3;
  sigCtx.lineCap = 'round';
  sigCtx.lineJoin = 'round';

  function getPos(e) {
    const rect = sigCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (sigCanvas.width / rect.width),
      y: (clientY - rect.top) * (sigCanvas.height / rect.height)
    };
  }

  // Mouse Events
  sigCanvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    hasSigned = true;
    const pos = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
  });

  sigCanvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
  });

  window.addEventListener('mouseup', () => { isDrawing = false; });

  // Touch Events (Mobile)
  sigCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    hasSigned = true;
    const pos = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
  }, { passive: false });

  sigCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
  }, { passive: false });

  window.addEventListener('touchend', () => { isDrawing = false; });
}

function clearSignature() {
  if (sigCtx && sigCanvas) {
    sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    hasSigned = false;
  }
}

// -------------------------------------------------------------
// Approve Consent & Push Insurance
// -------------------------------------------------------------
async function approveConsent() {
  // If user didn't draw, generate a clean digital stamp signature automatically
  let signatureData = 'AADHAAR_BIOMETRIC_TOUCH_SIGNATURE';
  if (hasSigned && sigCanvas) {
    signatureData = sigCanvas.toDataURL('image/png');
  }

  // Stop siren
  if (window.SoundSystem) {
    SoundSystem.stopSiren();
    SoundSystem.playSuccessChime();
  }

  const signerName = currentRelativeId === 'ROHAN-101' ? "Sunil Verma (Father)" : "Arjun Nair (Husband)";
  const relation = currentRelativeId === 'ROHAN-101' ? "Father" : "Husband";

  try {
    const res = await fetch('/api/consent/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: currentRelativeId,
        signerName: signerName,
        relation: relation,
        signatureData: signatureData,
        hospitalGps: "30.9010° N, 75.8573° E (Apollo ER Ludhiana)"
      })
    });
    const data = await res.json();

    if (data.success) {
      dismissModal();

      // Show receipt on family app
      const receiptCard = document.getElementById('consent-receipt-card');
      const tokenEl = document.getElementById('receipt-token');
      if (receiptCard && tokenEl) {
        receiptCard.style.display = 'block';
        tokenEl.innerText = data.consentToken;
      }

      showToast(`✅ LEGAL CONSENT GRANTED! Unlocked Tier 2 & pushed PM-RAHAT ₹1.5L insurance token to Apollo ER desk in real-time.`, 'success', 8000);
    }
  } catch (err) {
    showToast('Approval error: ' + err.message, 'danger');
  }
}

function dismissModal() {
  const overlay = document.getElementById('emergency-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  if (window.SoundSystem) SoundSystem.stopSiren();
}

// -------------------------------------------------------------
// Emergency Override Police Audit Handlers
// -------------------------------------------------------------
function handleOverridePoliceAudit(data) {
  const audit = data.audit;
  if (!audit) return;

  currentAuditData = audit;

  // Stop siren if playing
  if (window.SoundSystem) {
    SoundSystem.stopSiren();
    SoundSystem.playClick();
  }

  // Close normal request modal if open
  dismissModal();

  // Populate Police Audit Modal
  const modalFace = document.getElementById('audit-modal-face');
  const modalDoctor = document.getElementById('audit-modal-doctor');
  const modalId = document.getElementById('audit-modal-id');
  const modalHospital = document.getElementById('audit-modal-hospital');
  const modalStation = document.getElementById('audit-modal-station');
  const modalDocket = document.getElementById('audit-modal-docket');
  const modalGps = document.getElementById('audit-modal-gps');
  const modalTimestamp = document.getElementById('audit-modal-timestamp');
  const modalReason = document.getElementById('audit-modal-reason');

  if (modalFace) modalFace.src = audit.faceScanDataUrl;
  if (modalDoctor) modalDoctor.innerText = audit.authorizedBy;
  if (modalId) modalId.innerText = `${audit.idType}: ${audit.idNumber}`;
  if (modalHospital) modalHospital.innerText = audit.hospitalName;
  if (modalStation) modalStation.innerText = audit.policeStationNotified;
  if (modalDocket) modalDocket.innerText = audit.policeDocketNumber;
  if (modalGps) modalGps.innerText = audit.gpsCoordinates;
  if (modalTimestamp) modalTimestamp.innerText = new Date(audit.timestamp).toLocaleTimeString();
  if (modalReason) modalReason.innerText = audit.reason;

  // Show Police Modal
  openPoliceAuditModal();

  // Populate and show dashboard card
  displayPoliceReceiptCard(audit);

  showToast(`🚨 ATTENDING DOCTOR OVERRIDE: ${audit.authorizedBy} biometrically authenticated & dispatched to ${audit.policeStationNotified}!`, 'danger', 10000);
}

function openPoliceAuditModal() {
  const overlay = document.getElementById('override-police-modal-overlay');
  if (overlay) overlay.style.display = 'flex';
}

function dismissPoliceModal() {
  const overlay = document.getElementById('override-police-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

function displayPoliceReceiptCard(audit) {
  const card = document.getElementById('override-police-receipt-card');
  const faceImg = document.getElementById('police-receipt-face');
  const docEl = document.getElementById('police-receipt-doctor');
  const idEl = document.getElementById('police-receipt-id');
  const stEl = document.getElementById('police-receipt-station');
  const dkEl = document.getElementById('police-receipt-docket');

  if (card && faceImg && docEl && idEl && stEl && dkEl) {
    faceImg.src = audit.faceScanDataUrl;
    docEl.innerText = audit.authorizedBy;
    idEl.innerText = `${audit.idType}: ${audit.idNumber}`;
    stEl.innerText = audit.policeStationNotified;
    dkEl.innerText = audit.policeDocketNumber;
    card.style.display = 'block';
  }
}

async function checkCurrentStatus() {
  try {
    const res = await fetch(`/api/patients/${currentRelativeId}?tier=2`);
    const data = await res.json();
    if (data.isUnlocked && data.overrideAudit) {
      currentAuditData = data.overrideAudit;
      displayPoliceReceiptCard(data.overrideAudit);
    } else if (data.isUnlocked && data.consentToken) {
      const receiptCard = document.getElementById('consent-receipt-card');
      const tokenEl = document.getElementById('receipt-token');
      if (receiptCard && tokenEl) {
        receiptCard.style.display = 'block';
        tokenEl.innerText = data.consentToken;
      }
    }
  } catch (e) {
    console.warn('Status check notice:', e);
  }
}
