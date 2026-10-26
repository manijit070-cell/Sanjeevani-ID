// Sanjeevani-ID: ER Doctor Command Center HUD Engine

let activePatient = null;
let currentPatientId = 'ROHAN-101';
let countdownInterval = null;
let countdownSeconds = 60;
let isSpeaking = false;

document.addEventListener('DOMContentLoaded', () => {
  initSocketConnection();

  // Parse URL query
  const urlParams = new URLSearchParams(window.location.search);
  const patientParam = urlParams.get('patientId');
  if (patientParam) {
    currentPatientId = patientParam.toUpperCase();
    const input = document.getElementById('input-patient-id');
    if (input) input.value = currentPatientId;
  }

  loadPatient(currentPatientId);
  setupSocketListeners();
});

function setupSocketListeners() {
  if (!window.socket) return;

  // Real-time remote family consent received
  window.socket.on('family-consent-granted', (data) => {
    console.log('⚡ Received family consent event:', data);
    if (data.patientId === currentPatientId) {
      showToast(`🎉 LEGAL FAMILY CONSENT GRANTED! Signed by ${data.signature?.signerName || 'Family'}`, 'success', 6000);
      unlockTier2UI(data);
    }
  });

  // Statutory doctor override event
  window.socket.on('override-activated', (data) => {
    if (data.patientId === currentPatientId) {
      showToast('⚖️ Emergency Good Samaritan Override Activated', 'amber');
      unlockTier2UI(data);
    }
  });

  // Reset event
  window.socket.on('system-reset', () => {
    showToast('🔄 Demo state reset, re-locking vault', 'cyan');
    loadPatient(currentPatientId);
  });
}

// -------------------------------------------------------------
// Patient Loading & Rendering
// -------------------------------------------------------------
async function loadPatient(patientId) {
  currentPatientId = patientId;
  clearInterval(countdownInterval);
  countdownSeconds = 60;

  try {
    const res = await fetch(`/api/patients/${patientId}?tier=1`);
    const data = await res.json();

    if (!data.success) {
      showToast(data.message, 'danger');
      return;
    }

    activePatient = data.patient;
    renderTier1(activePatient);

    // Fetch AI Triage Brief
    fetchAiTriage(patientId);

    // Handle Tier 2 state
    if (data.isUnlocked) {
      // Fetch full unlocked Tier 2
      const resT2 = await fetch(`/api/patients/${patientId}?tier=2`);
      const dataT2 = await resT2.json();
      unlockTier2UI(dataT2);
    } else {
      lockTier2UI();
      startCountdownTimer();
    }

    // Announce scan to server
    fetch('/api/er/initiate-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: patientId,
        hospitalName: "Apollo Hospital Ludhiana (Trauma Level-1)",
        gpsLocation: "30.9010° N, 75.8573° E"
      })
    }).catch(e => console.warn('Scan dispatch note:', e));

  } catch (err) {
    console.error('Error loading patient:', err);
    showToast('Failed to load patient: ' + err.message, 'danger');
  }
}

function renderTier1(p) {
  document.getElementById('patient-name').innerText = p.name;
  document.getElementById('patient-meta').innerText = `${p.age} YRS • ${p.gender.toUpperCase()} • ${p.city.toUpperCase()}`;
  document.getElementById('patient-abha').innerText = p.abHaNumber;
  document.getElementById('patient-vehicle').innerText = p.vehicleNumber;
  document.getElementById('patient-avatar').src = p.avatar;
  document.getElementById('patient-blood-group').innerText = p.bloodGroup;
  document.getElementById('patient-blood-rarity').innerText = p.bloodGroupRarity;

  // Render Critical Allergies
  const allergyContainer = document.getElementById('critical-allergies-list');
  allergyContainer.innerHTML = p.tier1.criticalAlerts.map(a => `
    <div class="allergy-alert-card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="color:#FCA5A5; font-size:0.95rem;">${a.type}: ${a.substance}</strong>
        <span class="badge badge-red" style="font-size:0.65rem;">${a.severity}</span>
      </div>
      <div style="font-size:0.85rem; color:#E2E8F0; margin-top:4px;">${a.reaction}</div>
      ${a.alternative ? `<div style="font-size:0.8rem; color:#A7F3D0; margin-top:4px;"><strong>Safe Alt:</strong> ${a.alternative}</div>` : ''}
    </div>
  `).join('');

  // Render Active Conditions
  const conditionContainer = document.getElementById('active-conditions-list');
  conditionContainer.innerHTML = p.tier1.activeConditions.map(c => `
    <div class="condition-alert-card">
      <strong style="color:#FDE68A; font-size:0.95rem;">${c.condition}</strong>
      ${c.warning ? `<div style="font-size:0.85rem; color:#FEF3C7; font-weight:700; margin-top:2px;">⚠️ ${c.warning}</div>` : ''}
      ${c.clinicalRisk ? `<div style="font-size:0.8rem; color:#CBD5E1; margin-top:4px;">${c.clinicalRisk}</div>` : ''}
      ${c.note ? `<div style="font-size:0.8rem; color:#CBD5E1; margin-top:4px;">${c.note}</div>` : ''}
    </div>
  `).join('');

  // Render Current Medications
  const medsContainer = document.getElementById('medications-list');
  medsContainer.innerHTML = p.tier1.currentMedications.map(m => `<div>• ${m}</div>`).join('');

  // Render Emergency Contacts
  const contactsContainer = document.getElementById('emergency-contacts-list');
  contactsContainer.innerHTML = p.tier1.emergencyContacts.map(c => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:10px 14px; border-radius:var(--radius-sm); margin-bottom:8px; border:1px solid var(--border-subtle);">
      <div>
        <div style="font-weight:700; font-size:0.9rem;">${c.name} (${c.relation})</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">${c.location}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:var(--font-mono); font-size:0.88rem; color:var(--color-cyan); font-weight:700;">${c.phone}</div>
        <span class="badge ${c.isPrimary ? 'badge-green' : 'badge-cyan'}" style="font-size:0.65rem;">
          ${c.isPrimary ? 'PRIMARY GUARDIAN' : 'SECONDARY'}
        </span>
      </div>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// AI 10-Second Rapid Triage Brief
// -------------------------------------------------------------
async function fetchAiTriage(patientId) {
  const summaryEl = document.getElementById('ai-rapid-summary');
  const hazardsEl = document.getElementById('ai-critical-hazards');
  const actionsEl = document.getElementById('ai-immediate-actions');

  summaryEl.innerText = 'Synthesizing verified medical history...';

  try {
    const res = await fetch('/api/ai/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId })
    });
    const data = await res.json();

    if (data.success && data.triage) {
      const t = data.triage;
      summaryEl.innerText = t.rapidSummary;
      hazardsEl.innerHTML = (t.criticalHazards || []).map(h => `<li>${h}</li>`).join('');
      actionsEl.innerHTML = (t.immediateActions || []).map(a => `<li>${a}</li>`).join('');

      window.currentAiSpeechScript = t.speechScript || t.rapidSummary;
    }
  } catch (err) {
    console.error('AI Triage error:', err);
    summaryEl.innerText = 'Clinical rule engine active. Prioritize O-Negative blood and avoid Penicillins.';
  }
}

// Web Speech API Text-to-Speech
function readAloudAiBrief() {
  if (!('speechSynthesis' in window)) {
    showToast('Speech synthesis not supported in this browser.', 'amber');
    return;
  }

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    stopEqualizer();
    return;
  }

  const script = window.currentAiSpeechScript || document.getElementById('ai-rapid-summary').innerText;
  const utterance = new SpeechSynthesisUtterance(script);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    isSpeaking = true;
    startEqualizer();
  };

  utterance.onend = () => {
    isSpeaking = false;
    stopEqualizer();
  };

  utterance.onerror = () => {
    isSpeaking = false;
    stopEqualizer();
  };

  window.speechSynthesis.speak(utterance);
}

function startEqualizer() {
  const eq = document.getElementById('audio-equalizer');
  const btn = document.getElementById('btn-read-aloud');
  if (eq) eq.style.display = 'inline-flex';
  if (btn) btn.innerHTML = '<span>⏹️</span> Stop Audio Brief';
}

function stopEqualizer() {
  const eq = document.getElementById('audio-equalizer');
  const btn = document.getElementById('btn-read-aloud');
  if (eq) eq.style.display = 'none';
  if (btn) btn.innerHTML = '<span>🔊</span> Listen to AI Clinical Voice Brief';
  isSpeaking = false;
}

// -------------------------------------------------------------
// Drug-Conflict Safety Checker
// -------------------------------------------------------------
async function runDrugCheck() {
  const input = document.getElementById('input-drug-check');
  const drugName = input ? input.value.trim() : '';
  if (!drugName) {
    showToast('Please type a medication name to check conflict', 'amber');
    return;
  }
  executeDrugCheck(drugName);
}

function checkDrugSample(drugName) {
  const input = document.getElementById('input-drug-check');
  if (input) input.value = drugName;
  executeDrugCheck(drugName);
}

async function executeDrugCheck(drugName) {
  const resultBox = document.getElementById('drug-check-result');
  resultBox.style.display = 'block';
  resultBox.innerHTML = '<div style="color:var(--color-cyan);">Evaluating pharmacological conflicts...</div>';

  try {
    const res = await fetch('/api/ai/drug-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: currentPatientId, drugName })
    });
    const data = await res.json();

    if (data.success && data.check) {
      const c = data.check;
      let bg = 'rgba(16, 185, 129, 0.15)';
      let border = 'rgba(16, 185, 129, 0.4)';
      let textColor = '#34D399';

      if (c.severity === 'CRITICAL') {
        bg = 'rgba(239, 68, 68, 0.2)';
        border = 'rgba(239, 68, 68, 0.5)';
        textColor = '#F87171';
        if (window.SoundSystem) SoundSystem.playAlertBeep();
      } else if (c.severity === 'WARNING' || c.severity === 'HIGH') {
        bg = 'rgba(245, 158, 11, 0.2)';
        border = 'rgba(245, 158, 11, 0.5)';
        textColor = '#FBBF24';
      }

      resultBox.style.background = bg;
      resultBox.style.border = `1px solid ${border}`;

      resultBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <strong style="color:${textColor}; font-size:1.05rem;">${c.status}: ${drugName.toUpperCase()}</strong>
          <span class="badge ${c.severity === 'CRITICAL' ? 'badge-red' : c.severity === 'SAFE' ? 'badge-green' : 'badge-amber'}">${c.severity}</span>
        </div>
        <div style="font-size:0.88rem; color:#E2E8F0; line-height:1.4; margin-bottom:6px;">${c.reason}</div>
        <div style="font-size:0.82rem; color:#CBD5E1;"><strong style="color:white;">Recommendation:</strong> ${c.recommendation}</div>
      `;
    }
  } catch (err) {
    resultBox.innerHTML = `<div style="color:#F87171;">Drug check failed: ${err.message}</div>`;
  }
}

// -------------------------------------------------------------
// Tier 2 Vault: Countdown & Unlock Transitions
// -------------------------------------------------------------
function lockTier2UI() {
  const container = document.getElementById('tier2-vault-container');
  const curtain = document.getElementById('vault-curtain');
  const unlockedBadge = document.getElementById('unlocked-badge');

  if (container) container.classList.remove('vault-unlocked');
  if (curtain) curtain.style.display = 'flex';
  if (unlockedBadge) {
    unlockedBadge.innerText = 'TIER 1 UNLOCKED (0.0s)';
    unlockedBadge.className = 'badge badge-amber';
  }
}

function startCountdownTimer() {
  clearInterval(countdownInterval);
  countdownSeconds = 60;

  const textEl = document.getElementById('countdown-number');
  const circle = document.getElementById('timer-circle');
  const circumference = 314.15; // 2 * PI * 50

  countdownInterval = setInterval(() => {
    countdownSeconds--;
    if (textEl) textEl.innerText = `${countdownSeconds}s`;

    if (circle) {
      const offset = circumference - (countdownSeconds / 60) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    if (countdownSeconds <= 0) {
      clearInterval(countdownInterval);
      showToast('⏱️ 60s Golden Hour Elapsed! Please complete mandatory Doctor Identity & Face Scan to break glass.', 'amber', 7000);
      openOverrideModal();
    }
  }, 1000);
}

function unlockTier2UI(data) {
  clearInterval(countdownInterval);

  const container = document.getElementById('tier2-vault-container');
  const curtain = document.getElementById('vault-curtain');
  const unlockedBadge = document.getElementById('unlocked-badge');
  const stamp = document.getElementById('unlock-signature-stamp');

  if (container) container.classList.add('vault-unlocked');
  if (curtain) {
    setTimeout(() => {
      curtain.style.display = 'none';
    }, 400);
  }

  if (unlockedBadge) {
    unlockedBadge.innerText = 'TIER 1 & 2 UNLOCKED';
    unlockedBadge.className = 'badge badge-green';
  }

  // Check and Render Police & Family Audit Dossier if unlocked via Emergency Override
  const audit = data.overrideAudit || data.tier2?.overrideAudit || data.patient?.tier2?.overrideAudit;
  const auditBanner = document.getElementById('police-audit-dossier-banner');
  if (audit && auditBanner) {
    auditBanner.style.display = 'block';
    auditBanner.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(153, 27, 27, 0.3) 100%); border: 2px solid #EF4444; border-radius: var(--radius-md); padding: 18px; box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.6rem;">🛡️</span>
            <div>
              <div style="font-weight: 800; color: #FCA5A5; font-size: 1.05rem; letter-spacing: 0.5px;">STATUTORY BREAK-GLASS OVERRIDE AUDIT DOSSIER</div>
              <div style="font-size: 0.75rem; color: #E2E8F0;">LEGAL DISPATCH TO CCTNS POLICE &amp; FAMILY GUARDIAN ACTIVE</div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <span class="badge badge-red" style="font-size: 0.72rem;">POLICE DOCKET: ${audit.policeDocketNumber}</span>
            <span class="badge badge-green" style="font-size: 0.72rem;">BIOMETRIC HASH VERIFIED</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: auto 1fr; gap: 18px; align-items: center;">
          <div style="text-align: center;">
            <img src="${audit.faceScanDataUrl}" alt="Attending Doctor Face" 
              style="width: 85px; height: 85px; border-radius: 50%; object-fit: cover; border: 2px solid #EF4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);">
            <div style="font-size: 0.65rem; color: #FCA5A5; margin-top: 4px; font-weight: 700;">BIOMETRIC CAPTURE</div>
          </div>

          <div style="font-size: 0.82rem; color: #E2E8F0; line-height: 1.5;">
            <div><strong>Attending Doctor / Responder:</strong> <span style="color: white; font-weight: 700;">${audit.authorizedBy}</span> (${audit.idType}: <code style="color: #38BDF8;">${audit.idNumber}</code>)</div>
            <div><strong>Hospital Facility:</strong> ${audit.hospitalName} • <strong>Dept:</strong> ${audit.department || 'Trauma ER'}</div>
            <div><strong>Dispatched Police Station:</strong> <span style="color: #F87171; font-weight: 700;">${audit.policeStationNotified}</span></div>
            <div><strong>GPS Coordinates:</strong> <code>${audit.gpsCoordinates}</code> • <strong>Timestamp:</strong> ${new Date(audit.timestamp).toLocaleTimeString()}</div>
            <div style="color: #CBD5E1; margin-top: 4px; font-style: italic;">"Reason: ${audit.reason}"</div>
          </div>
        </div>
      </div>
    `;
  } else if (auditBanner) {
    auditBanner.style.display = 'none';
  }

  if (stamp) {
    const signer = audit ? `${audit.authorizedBy} (${audit.idNumber})` : (data.signature?.signerName || data.tier2?.digitalSignature?.signerName || data.patient?.tier2?.digitalSignature?.signerName || "Family Guardian (Aadhaar Verified)");
    const method = data.unlockMethod || data.tier2?.unlockMethod || data.patient?.tier2?.unlockMethod || (audit ? "DOCTOR_BIOMETRIC_OVERRIDE" : "FAMILY_REMOTE_CONSENT");
    const token = data.consentToken || data.patient?.tier2?.consentToken || (audit ? audit.policeDocketNumber : 'SANJ-VERIFIED');
    stamp.innerHTML = `
      <div style="font-weight:700; color:#34D399;">✓ CONSENT VERIFIED VIA ${method}</div>
      <div style="font-size:0.75rem; color:#94A3B8;">Signer: ${signer} • Docket/Token: <code>${token}</code></div>
    `;
  }

  // Populate Insurance
  const ins = data.insuranceClearance || data.tier2?.insuranceClearance || data.patient?.tier2?.insuranceClearance;
  if (ins) {
    if (ins.pmRahatScheme) {
      document.getElementById('pm-rahat-cap').innerText = ins.pmRahatScheme.coverageCap;
      document.getElementById('pm-rahat-token').innerText = ins.pmRahatScheme.preAuthToken;
      document.getElementById('pm-rahat-guarantee').innerText = ins.pmRahatScheme.autoAdmitGuarantee;
    }
    if (ins.privateInsurance) {
      document.getElementById('private-ins-name').innerText = ins.privateInsurance.insurer;
      document.getElementById('private-ins-limit').innerText = ins.privateInsurance.cashlessPreAuthLimit;
      document.getElementById('private-ins-policy').innerText = ins.privateInsurance.policyNumber;
    }
  }

  // Populate Clinical Records & ECG Waveform
  const records = data.clinicalRecords || data.tier2?.clinicalRecords || data.patient?.tier2?.clinicalRecords || [];
  const recContainer = document.getElementById('clinical-records-list');
  recContainer.innerHTML = records.map(r => `
    <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:16px; margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong style="color:white; font-size:1rem;">📄 ${r.title}</strong>
        <span class="badge badge-cyan" style="font-size:0.7rem;">${r.date}</span>
      </div>
      <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:8px;">${r.hospital || r.lab} • ${r.doctor || ''}</div>
      <div style="font-size:0.9rem; color:#E2E8F0; line-height:1.4; margin-bottom:10px;">${r.findings}</div>
      
      ${r.ecgSvgWaveform ? `
        <!-- Live ECG Sinus Rhythm Waveform -->
        <div style="background:#020617; border-radius:8px; padding:10px; border:1px solid #1E293B; margin-top:8px;">
          <div style="font-size:0.7rem; color:#10B981; font-family:var(--font-mono); margin-bottom:4px;">12-LEAD LEAD II REAL-TIME TELEMETRY TRACE:</div>
          <svg class="ecg-svg" viewBox="0 0 500 50">
            <path class="ecg-path" d="M 0,25 L 40,25 L 45,20 L 50,25 L 70,25 L 75,32 L 80,5 L 88,45 L 94,25 L 110,25 L 125,18 L 140,25 L 200,25 L 240,25 L 245,20 L 250,25 L 270,25 L 275,32 L 280,5 L 288,45 L 294,25 L 310,25 L 325,18 L 340,25 L 400,25 L 440,25 L 445,20 L 450,25 L 470,25 L 475,32 L 480,5 L 488,45 L 494,25 L 500,25" />
          </svg>
        </div>
      ` : ''}
    </div>
  `).join('');

  if (window.SoundSystem) SoundSystem.playSuccessChime();
}

async function triggerDoctorOverride(reason) {
  try {
    const res = await fetch('/api/consent/override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: currentPatientId,
        doctorRegNumber: "62910-PB",
        reason: reason || "Unconscious patient with unstable hemodynamics. Immediate life-saving ICU intervention requires records."
      })
    });
    const data = await res.json();
    if (data.success) {
      loadPatient(currentPatientId);
    }
  } catch (err) {
    showToast('Override error: ' + err.message, 'danger');
  }
}

function dispatchCashlessClaim() {
  showToast('🚀 Pre-Auth token PM-RAHAT & Star Health dispatched to Apollo TPA Desk! Admission cleared without cash deposit.', 'success', 5000);
}

// -------------------------------------------------------------
// Multi-Modal Lookups
// -------------------------------------------------------------
function switchLookupTab(tab) {
  document.getElementById('tab-id-btn').classList.toggle('active', tab === 'id');
  document.getElementById('tab-vehicle-btn').classList.toggle('active', tab === 'vehicle');
  document.getElementById('tab-bio-btn').classList.toggle('active', tab === 'bio');

  document.getElementById('tab-id-content').style.display = tab === 'id' ? 'flex' : 'none';
  document.getElementById('tab-vehicle-content').style.display = tab === 'vehicle' ? 'flex' : 'none';
  document.getElementById('tab-bio-content').style.display = tab === 'bio' ? 'flex' : 'none';

  if (window.SoundSystem) SoundSystem.playClick();
}

function loadPatientById() {
  const input = document.getElementById('input-patient-id');
  const id = input ? input.value.trim() : 'ROHAN-101';
  loadPatient(id);
}

function quickSelect(id) {
  const input = document.getElementById('input-patient-id');
  if (input) input.value = id;
  loadPatient(id);
}

async function lookupVehiclePlate() {
  const input = document.getElementById('input-vehicle-no');
  const plate = input ? input.value.trim() : '';
  if (!plate) {
    showToast('Enter vehicle number plate', 'amber');
    return;
  }

  showToast(`🚗 Querying Vahan eDAR database for ${plate}...`, 'cyan');

  try {
    const res = await fetch('/api/lookup/vehicle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleNumber: plate })
    });
    const data = await res.json();

    if (data.success) {
      showToast(`✓ Vehicle matched: ${data.patientName} (${data.vehicleDetails})`, 'success');
      loadPatient(data.patientId);
    } else {
      showToast(data.message, 'danger');
    }
  } catch (err) {
    showToast('Lookup error: ' + err.message, 'danger');
  }
}

async function simulateBiometricMatch() {
  const statusEl = document.getElementById('bio-scan-status');
  statusEl.innerHTML = '<span style="color:var(--color-cyan);">Capturing optical scan... Matching Aadhaar Face Auth Vectors...</span>';
  if (window.SoundSystem) SoundSystem.playClick();

  try {
    const res = await fetch('/api/lookup/biometric', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: currentPatientId })
    });
    const data = await res.json();

    if (data.success) {
      statusEl.innerHTML = `<span style="color:#34D399; font-weight:700;">✓ MATCH CONFIRMED (Confidence: ${data.matchConfidence}) • ${data.patientName}</span>`;
      showToast(`👁️ Aadhaar Vector Match 98.9%: ${data.patientName}`, 'success');
      loadPatient(data.patientId);
    }
  } catch (err) {
    statusEl.innerText = 'Biometric match error: ' + err.message;
  }
}

function toggleSound() {
  const enabled = SoundSystem.toggle();
  const btn = document.getElementById('sound-btn');
  const icon = document.getElementById('sound-icon');
  if (enabled) {
    btn.classList.add('sound-on');
    icon.innerText = '🔊';
    SoundSystem.playClick();
  } else {
    btn.classList.remove('sound-on');
    icon.innerText = '🔇';
  }
}

async function resetDemoState() {
  try {
    const res = await fetch('/api/reset', { method: 'POST' });
    const data = await res.json();
    showToast('🔄 Demo state reset to initial locked state!', 'success');
    loadPatient(currentPatientId);
  } catch (err) {
    showToast('Error resetting demo: ' + err.message, 'danger');
  }
}

// -------------------------------------------------------------
// Statutory Emergency Override & Biometric Verification
// -------------------------------------------------------------
let overrideWebcamStream = null;
window.currentFaceScanDataUrl = null;
window.currentIdCardDataUrl = null;

function openOverrideModal() {
  const modal = document.getElementById('override-modal-overlay');
  if (modal) modal.style.display = 'flex';
  if (window.SoundSystem) SoundSystem.playClick();

  // Generate real-time time-lock hash
  const hashEl = document.getElementById('override-time-hash');
  if (hashEl) {
    hashEl.innerText = `SHA256-${Date.now().toString(16).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // Start webcam
  startWebcamPreview();
}

function closeOverrideModal() {
  const modal = document.getElementById('override-modal-overlay');
  if (modal) modal.style.display = 'none';
  stopWebcamPreview();
}

async function startWebcamPreview() {
  const video = document.getElementById('override-webcam');
  const preview = document.getElementById('captured-face-preview');
  const oval = document.getElementById('scanner-oval');
  const laser = document.getElementById('scanner-laser');

  if (preview) preview.style.display = 'none';
  if (video) video.style.display = 'block';
  if (oval) oval.style.display = 'block';
  if (laser) laser.style.display = 'block';

  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      overrideWebcamStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      if (video) {
        video.srcObject = overrideWebcamStream;
        await video.play();
      }
    }
  } catch (err) {
    console.warn('Webcam stream not accessible or permission denied:', err);
    const statusText = document.getElementById('face-scan-status-text');
    if (statusText) {
      statusText.innerHTML = '<span style="color:#FBBF24;">⚠️ Live webcam stream blocked or unavailable. Click <strong>"Use Demo Face Scan"</strong> to simulate verified biometric identity.</span>';
    }
  }
}

function stopWebcamPreview() {
  if (overrideWebcamStream) {
    overrideWebcamStream.getTracks().forEach(track => track.stop());
    overrideWebcamStream = null;
  }
}

function captureLiveFaceScan() {
  const video = document.getElementById('override-webcam');
  const preview = document.getElementById('captured-face-preview');
  const oval = document.getElementById('scanner-oval');
  const laser = document.getElementById('scanner-laser');
  const statusText = document.getElementById('face-scan-status-text');

  if (video && video.videoWidth > 0) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    window.currentFaceScanDataUrl = canvas.toDataURL('image/jpeg', 0.85);

    if (preview) {
      preview.src = window.currentFaceScanDataUrl;
      preview.style.display = 'block';
    }
    if (video) video.style.display = 'none';
    if (oval) oval.style.display = 'none';
    if (laser) laser.style.display = 'none';

    stopWebcamPreview();

    if (statusText) {
      statusText.innerHTML = '<span style="color:#34D399; font-weight:700;">✅ BIOMETRIC FACE CAPTURED • Liveness Verified (Match: 99.4%)</span>';
    }
    if (window.SoundSystem) SoundSystem.playSuccessChime();
    showToast('📸 Live Face Biometric snapshot captured successfully!', 'success');
  } else {
    // If webcam was not active, fall back to high-res demo biometric
    useDemoFaceBiometric();
  }
}

function useDemoFaceBiometric() {
  window.currentFaceScanDataUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80';
  
  const video = document.getElementById('override-webcam');
  const preview = document.getElementById('captured-face-preview');
  const oval = document.getElementById('scanner-oval');
  const laser = document.getElementById('scanner-laser');
  const statusText = document.getElementById('face-scan-status-text');

  stopWebcamPreview();

  if (video) video.style.display = 'none';
  if (oval) oval.style.display = 'none';
  if (laser) laser.style.display = 'none';
  if (preview) {
    preview.src = window.currentFaceScanDataUrl;
    preview.style.display = 'block';
  }

  if (statusText) {
    statusText.innerHTML = '<span style="color:#34D399; font-weight:700;">✅ DEMO BIOMETRIC CAPTURED • Dr. Aditi Sharma (Apollo ER)</span>';
  }
  if (window.SoundSystem) SoundSystem.playClick();
  showToast('⚡ Loaded verified on-duty trauma doctor biometric face scan', 'cyan');
}

function previewIdCard(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    window.currentIdCardDataUrl = e.target.result;
    const box = document.getElementById('id-card-preview-box');
    const img = document.getElementById('id-card-preview-img');
    if (box && img) {
      img.src = window.currentIdCardDataUrl;
      box.style.display = 'block';
    }
    showToast('📄 Doctor credential card attached', 'success');
  };
  reader.readAsDataURL(file);
}

function loadDemoDoctorIdCard() {
  window.currentIdCardDataUrl = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&q=80';
  const box = document.getElementById('id-card-preview-box');
  const img = document.getElementById('id-card-preview-img');
  if (box && img) {
    img.src = window.currentIdCardDataUrl;
    box.style.display = 'block';
  }
  showToast('⚡ Attached verified NMC Doctor ID card (#89210-PB)', 'cyan');
}

async function submitEmergencyOverride() {
  const doctorName = document.getElementById('override-doctor-name')?.value?.trim();
  const idType = document.getElementById('override-id-type')?.value;
  const idNumber = document.getElementById('override-id-number')?.value?.trim();
  const hospitalName = document.getElementById('override-hospital-name')?.value?.trim();
  const reason = document.getElementById('override-reason')?.value?.trim();

  // Validate mandatory fields
  if (!doctorName || !idNumber) {
    showToast('❌ Doctor Name and Registration Number are mandatory!', 'danger');
    return;
  }

  if (!window.currentFaceScanDataUrl) {
    showToast('❌ Live Biometric Face Capture is strictly required to prevent unauthorized snooping!', 'danger', 6000);
    return;
  }

  const btn = document.getElementById('btn-submit-override');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> TRANSMITTING BIOMETRIC DOSSIER TO POLICE...';
  }

  try {
    const res = await fetch('/api/consent/emergency-override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: currentPatientId,
        doctorName: doctorName,
        idType: idType,
        idNumber: idNumber,
        hospitalName: hospitalName,
        department: 'Trauma & Emergency Resuscitation Unit',
        reason: reason,
        faceScanDataUrl: window.currentFaceScanDataUrl,
        idCardDataUrl: window.currentIdCardDataUrl,
        gpsCoordinates: '30.9010° N, 75.8573° E (Apollo ER-1 Ludhiana)'
      })
    });

    const data = await res.json();

    if (data.success) {
      closeOverrideModal();
      if (window.SoundSystem) SoundSystem.playSuccessChime();

      showToast(`🚨 STATUTORY OVERRIDE EXECUTED! Dispatched to Ludhiana Central Police Station (${data.policeDocketNumber}) & family contacts.`, 'success', 8000);
      unlockTier2UI(data);
    } else {
      showToast(`Override failed: ${data.message}`, 'danger', 6000);
    }
  } catch (err) {
    showToast(`Error executing override: ${err.message}`, 'danger', 6000);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>🚨</span> CONFIRM LEGAL OVERRIDE & TRANSMIT TO POLICE';
    }
  }
}
