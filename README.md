# 🛡️ SANJEEVANI-ID
### National Digital Public Infrastructure (DPI) for Zero-OTP Unconscious ER Triage & Remote Family Consent Bridge
> Built for Indian Emergency Trauma Care • 100% Free Tier Services • Zero External Physical Hardware Required

---

## 🚨 The Critical Problem: The Indian "Golden Hour" Trauma Crisis
Every day on Indian highways and city roads, thousands of accident victims and senior citizens collapse unconscious and are rushed by 108 ambulances to emergency rooms. 

Doctors consistently lose the critical **"Golden Hour"** due to three fatal structural bottlenecks:
1. **Phone Locked / Shattered:** The victim's phone is either locked or crushed in the collision.
2. **The DigiLocker / ABHA OTP Deadlock:** Government health records and DigiLocker require an SMS OTP sent to the victim's locked, shattered phone—creating an impossible deadlock.
3. **Private Hospital ICU Admission Barrier:** Private hospitals frequently delay ICU admission and life-saving surgery until family arrives in person to deposit cash or sign high-risk legal consent forms.
4. **Apple / Android Medical ID Flaws:** Rely on unverified user-typed static text (which doctors cannot legally trust for blood or surgery), lack hospital-grade ECGs/discharge summaries, leak emergency contacts to phone thieves on lock screens, and cannot handle cashless insurance pre-authorizations.

---

## ⚡ The Sanjeevani-ID Solution
**Sanjeevani-ID** is an end-to-end, zero-cost Digital Public Infrastructure (DPI) prototype built for the National Health Authority (NHA) ecosystem:

- **Device-Independent Multi-Modal Lookup:** Lookup patients via ₹5 wallet/helmet QR code, **Vehicle License Plate Number** (integrated with Vahan eDAR accident records), or **Aadhaar Biometric Face Match**.
- **Two-Tier "Break-Glass" Privacy Architecture:**
  - **Tier 1 (Instant 0-Second Life-Saver Access):** Unlocks Blood Group (e.g. rare `O-`), Fatal Drug Allergies (e.g. `Fatal Penicillin Anaphylaxis`), Active Stents / Blood Thinners (`Clopidogrel hemorrhage hazard`), and an **AI 10-Second Voice Brief** synthesized via Gemini AI and Web Speech API.
  - **Tier 2 (Deep Surgical Vault & Financial Clearance):** Deep hospital discharge PDFs, past 12-lead ECG telemetry strips, and cashless insurance pre-auth remain cryptographically blurred.
- **Remote Family Guardian Siren & Digital Consent:** Instantly rings emergency family contacts 500 km away via encrypted WebSockets with a live emergency siren and phone vibration. The family reviews verified hospital GPS coordinates and executes a **1-Tap Legal Digital Signature**.
- **Instant PM-RAHAT ₹1.5 Lakh Cashless Guarantee:** Automatically unlocks the Government of India's **PM-RAHAT Cashless Road Accident Scheme token (₹1,50,000)** and private insurance pre-authorization (e.g., Star Health ₹5,00,000) directly onto the ER billing desk—eliminating the "cash deposit before ICU" delay.
- **Anti-Snooping Statutory Override with Police & Family Dispatch:** If the remote family is unreachable during trauma and emergency break-glass is required, an unauthorized person cannot simply click override. The attending doctor or responding medic MUST upload their **Doctor Registration ID (NMC/State Medical Council)** or **Aadhaar Card**, and capture a **Live Biometric Face Scan**. This complete identity dossier, along with hospital GPS telemetry, timestamp, and clinical justification, is **instantly transmitted to the local Police Station (CCTNS Unit)** and the patient's emergency family contacts—ensuring 100% legal accountability and preventing unauthorized record snooping.
- **60-Second Good Samaritan Golden Hour Timer:** A fail-safe countdown timer alerts the trauma team to initiate mandatory biometric identity verification if remote family response is delayed.

---

## 🏆 Innovation Matrix: Sanjeevani-ID vs Existing Systems

| Emergency Trauma Scenario | Apple / Android Medical ID | DigiLocker / ABHA PHR | **SANJEEVANI-ID (OUR SOLUTION)** |
| :--- | :--- | :--- | :--- |
| **Shattered Phone Screen** | ❌ 100% Inaccessible (Dead phone = Dead data) | ❌ Inaccessible (Cannot receive SMS OTP) | **✅ Device-Independent: Vehicle Plate / ₹5 Helmet QR / Biometric** |
| **Unconscious OTP Barrier** | ❌ Static basic notes only | ❌ Complete deadlock: Requires OTP sent to victim | **✅ Zero-OTP Break-Glass: Instant Tier-1 emergency access in 0.0s** |
| **Clinical Records Veracity** | ❌ Unverified user-typed notes | ⚠️ Fragmented unstructured PDFs | **✅ Hospital Golden-Master Stent Reports, 12-Lead ECGs & Drug Checker** |
| **Private Hospital Admission** | ❌ Zero financial clearance; ICU delayed for deposit | ❌ No emergency insurance tokens | **✅ PM-RAHAT ₹1.5L Cashless Claim Token + Private Pre-Auth** |
| **Remote Family Surgery Consent** | ❌ None (Family must physically travel 500 km) | ❌ No remote legal consent | **✅ Real-time WebSocket Siren + 1-Tap Legal Cryptographic Signature** |
| **Lock-Screen Privacy / Theft** | ❌ Leaks home contacts to strangers & thieves | ⚠️ Inaccessible in trauma | **✅ 2-Tier Architecture: Zero contact leaks on pass; GPS audit logged** |

---

## 💻 Enterprise Architecture & 100% Free Tech Stack (₹0 Cost)

- **Language & Runtime:** **TypeScript (ES2022, Strict Mode)** on Node.js v18+.
- **Web Framework:** **Express.js (v4.21)** with modular controllers, routes, and middleware.
- **Database Layer (Dual-Mode):**
  - **MongoDB with Mongoose (v9.11):** Strict schemas, typed models, and compound indexing for production cloud clusters (compatible with MongoDB Atlas Free Tier M0).
  - **Embedded High-Speed Store:** Zero-config JSON persistence (`data/db.json`) that kicks in automatically when offline or without MongoDB credentials.
- **Real-Time Communication:** **Socket.io (v4.8)** with typed WebSocket payloads for sub-second emergency sirens and instant Tier-2 unblurring.
- **AI Triage & Pharmacological Engine:**
  - **Google AI Studio Gemini API (`gemini-1.5-flash` / `gemini-2.5-flash`):** Free tier with 15 RPM / 1M TPM for instant natural language trauma triage synthesis.
  - **Built-in Clinical Decision Rule Engine:** Pharmacological contraindication checks (Beta-lactams, Sulfas, NSAIDs, DAPT bleeding risks) with 100% offline fallback.
- **Audio Synthesizer:** HTML5 `AudioContext` Web Audio API synthesizing multi-tone ambulance sirens and success chimes entirely in code (zero external MP3 files).
- **Haptic Feedback:** HTML5 `navigator.vibrate()` for mobile emergency alarms.
- **Speech Synthesis:** Browser-native `window.speechSynthesis` for spoken trauma briefings.
- **Dynamic QR Code Engine:** Native backend PNG generation endpoint (`/api/qr`) powered by `qrcode`.
- **Canvas Lock-Screen Wallpaper Generator:** HTML5 Canvas compositing high-res emergency pass badges directly onto mobile wallpapers.
- **Zero Paid Subscriptions:** Every single technology used runs on free tiers with ₹0 cost and zero credit card requirements.

---

## 📁 Project Directory Structure

```text
Sanjeevni-ID/
├── src/                          # TypeScript Enterprise Source
│   ├── config/
│   │   └── db.ts                 # Dual-Mode DB Manager (MongoDB Mongoose + Embedded Fallback)
│   ├── controllers/
│   │   ├── consent.controller.ts # Remote Family Signature & 60s Override
│   │   ├── lookup.controller.ts  # Vahan eDAR, Aadhaar Vector & Dynamic QR
│   │   ├── patient.controller.ts # Tier 1 (Masked) vs Tier 2 (Unmasked) Retrieval
│   │   └── triage.controller.ts  # AI Rapid Triage & Drug Conflict Checking
│   ├── data/
│   │   └── seedData.ts           # Clinical Emergency Seed Profiles (Rohan & Priya)
│   ├── middleware/
│   │   ├── error.middleware.ts   # Centralized HTTP Error Handling
│   │   └── logger.middleware.ts  # HTTP Request Audit Logger
│   ├── models/
│   │   └── patient.model.ts      # Mongoose Schema & Strict Data Validation
│   ├── routes/
│   │   ├── consent.routes.ts     # /api/consent/*
│   │   ├── index.ts              # Master API Router
│   │   ├── lookup.routes.ts      # /api/lookup/*
│   │   ├── patient.routes.ts     # /api/patients/*
│   │   └── triage.routes.ts      # /api/ai/*
│   ├── services/
│   │   ├── gemini.service.ts     # Google AI Studio Gemini API Client
│   │   ├── socket.service.ts     # Strongly-Typed Socket.io Real-Time Hub
│   │   └── triage.service.ts     # Clinical Decision & Drug Interaction Engine
│   ├── types/
│   │   ├── patient.types.ts      # Comprehensive TypeScript Patient Interfaces
│   │   └── socket.types.ts       # Typed WebSocket Events & Payloads
│   └── server.ts                 # Enterprise Server Entry Point
├── dist/                         # Compiled Production JavaScript Bundle
├── public/                       # Frontend Presentation & Emergency Interfaces
│   ├── css/
│   │   └── style.css             # Obsidian Glassmorphic Emergency HUD Design System
│   ├── js/
│   │   ├── audio.js              # Web Audio API Siren & Tone Synthesizer
│   │   ├── er-dashboard.js       # Trauma Doctor HUD Controller
│   │   ├── family.js             # Family Guardian Siren & Digital Signature Pad
│   │   ├── patient.js            # Victim Smartphone Pass & Wallpaper Generator
│   │   └── socket-client.js      # Typed Socket.io Client Wrapper
│   ├── er-dashboard.html         # ER Doctor Command Center HUD
│   ├── family.html               # Remote Family Guardian Mobile View
│   ├── index.html                # Hackathon Presentation & Live DPI Hub
│   └── patient.html              # Victim Smartphone Emergency Pass
├── data/
│   └── db.json                   # Auto-persisting Embedded Database Store
├── tsconfig.json                 # TypeScript Configuration (ES2022, Strict)
├── package.json                  # NPM Dependencies & Scripts
└── test_api.ts                   # Automated API Verification Suite
```

---

## 🚀 Quick Start & Commands

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Build & Compile TypeScript
```bash
npm run build
```
*(Compiles `src/**/*.ts` into `dist/**/*.js` with zero errors).*

### 4. Database Setup (Dual-Mode Flexibility)
- **Out-of-the-Box (Embedded Store):** You don't need to configure anything! The server will automatically use the embedded auto-persisting JSON database.
- **MongoDB Atlas Free Tier M0 (Optional):** If you'd like to use a cloud MongoDB database, add your connection string to `.env`:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sanjeevani?retryWrites=true&w=majority
  ```

### 5. Run the Server
- **Production Mode:**
  ```bash
  npm start
  ```
- **Development Watch Mode (Live Reload):**
  ```bash
  npm run dev
  ```
- **Run Automated API Verification Suite:**
  ```bash
  npx tsx test_api.ts
  ```

The server will start at: `http://localhost:3000`

---

## 📱 The Three Interactive Interfaces

| Interface | URL | Purpose |
| :--- | :--- | :--- |
| **Presentation Portal** | `http://localhost:3000` | Hackathon hub with live architecture matrix, feature breakdown, and demo reset. |
| **ER Doctor Command HUD** | `http://localhost:3000/er-dashboard.html` | Hospital ER laptop view with 0s Tier-1 triage, AI voice brief, drug conflict checker, and Tier-2 vault. |
| **Patient Pass & Wallpaper** | `http://localhost:3000/patient.html` | Mobile smartphone view with live emergency QR pass, Canvas wallpaper generator, and crash simulator. |
| **Remote Family Guardian** | `http://localhost:3000/family.html` | Remote family mobile view with emergency siren, GPS verification, and 1-tap digital signature approval. |

---

## 🎬 3-Minute Live Judge Demonstration Script

1. **Step 1: Open the ER Doctor HUD on your laptop** (`/er-dashboard.html`).
   - Show the judges: *"Imagine a highway crash victim has just arrived unconscious at Apollo Hospital Ludhiana. The phone is locked and smashed."*
   - Type Vehicle Number: `PB-10-AB-1234` or click *"Query Vahan eDAR Accident Registry"*.
   - **BAM (0.0s):** Patient Rohan Verma loads instantly! Show them:
     - **Blood Group O- Negative** (Universal Donor / Rare).
     - **Fatal Penicillin Anaphylaxis Alert**.
     - **Active Stent & Clopidogrel Warning** (Internal hemorrhage risk).
     - Click **"🔊 Listen to AI Clinical Voice Brief"**—the laptop reads aloud the trauma briefing with an animated equalizer!
     - In the Drug Conflict Checker, type **"Augmentin"** and click Check—flashes **CRITICAL CONTRAINDICATION** with clinical alternative!

2. **Step 2: Show the Locked Tier-2 Vault & Fail-Safe Timer.**
   - Point to the blurred bottom section: *"Notice that deep surgical PDFs and insurance tokens are locked. Private hospitals usually demand cash deposits now, costing lives."*
   - Show the **60-second Good Samaritan countdown ring** ticking.

3. **Step 3: Open Family Guardian on a second phone/tab** (`/family.html`).
   - Click **"Simulate Highway Crash"** on the Patient Pass or notice the live ER notification.
   - The family phone immediately erupts with an **emergency ambulance siren** and phone vibration!
   - Shows Apollo Hospital Ludhiana with GPS coordinates (`30.9010° N, 75.8573° E`).
   - Draw a digital legal signature on the canvas and tap **"1-TAP APPROVE MEDICAL ACCESS & PUSH INSURANCE"**.

4. **Step 4: The Live Unlock Moment.**
   - Switch eyes to the ER Doctor HUD: The siren stops, a triumphant bell chimes, and Tier 2 **animates unlocked live** over WebSockets!
   - Reveal the **PM-RAHAT ₹1,50,000 Cashless Token**, **Star Health Pre-Auth**, and **Medanta LAD Stent ECG waveform strip**!
   - Click *"Dispatch Cashless Claim Token"*—admission is cleared with zero cash deposit!

---

## 🌐 Instant Cloud Deployment (100% Free)

### Option A: Cloudflare Quick Tunnel (Instant Mobile HTTPS Access)
Run this command in a terminal while the server is running:
```bash
npx cloudflared tunnel --url http://localhost:3000
```
This gives you an instant public `https://....trycloudflare.com` URL that you can open on judges' and your own physical smartphones!

### Option B: Render.com Free Web Service
1. Push this repository to GitHub.
2. Create a **New Web Service** on [Render.com](https://render.com).
3. Set **Build Command:** `npm install` and **Start Command:** `npm start`.
4. Add environment variable `GEMINI_API_KEY` (optional).
5. The `/ping` endpoint keeps the service responsive.

---

## 📜 Legal & Compliance Alignment
- **Section 134A of the Motor Vehicles Act, 2019 (Good Samaritan Protection)**
- **Ministry of Road Transport and Highways (MoRTH) Cashless Road Accident Treatment Guidelines**
- **National Medical Commission (NMC) Emergency Resuscitation Directives**
- **Digital Personal Data Protection (DPDP) Act, 2023 (Two-Tier Purpose-Limited Consent)**

---

**Developed with ❤️ for National Healthcare Hackathons.**
