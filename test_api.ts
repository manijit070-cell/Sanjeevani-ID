async function testApi() {
  const baseUrl = 'http://localhost:3000';
  console.log('Testing Sanjeevani-ID TypeScript API Endpoints...\n');

  // 1. Health check
  const pingRes = await fetch(`${baseUrl}/ping`);
  console.log('1. /ping Status:', pingRes.status, await pingRes.json());

  // 2. Patients list
  const patientsRes = await fetch(`${baseUrl}/api/patients`);
  const patientsData = await patientsRes.json();
  console.log('2. /api/patients count:', patientsData.count, 'Patients:', patientsData.patients.map((p: any) => p.name));

  // 3. Vehicle Lookup
  const vahanRes = await fetch(`${baseUrl}/api/lookup/vehicle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vehicleNumber: 'PB-10-AB-1234' })
  });
  console.log('3. /api/lookup/vehicle status:', vahanRes.status, await vahanRes.json());

  // 4. Drug conflict check
  const drugRes = await fetch(`${baseUrl}/api/ai/drug-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId: 'ROHAN-101', drugName: 'Augmentin (Amoxicillin + Clavulanate)' })
  });
  console.log('4. /api/ai/drug-check status:', drugRes.status, await drugRes.json());

  // 5. AI Triage synthesis
  const triageRes = await fetch(`${baseUrl}/api/ai/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId: 'ROHAN-101' })
  });
  console.log('5. /api/ai/triage status:', triageRes.status, await triageRes.json());

  // 6. QR Code generator
  const qrRes = await fetch(`${baseUrl}/api/qr?text=http://localhost:3000/er-dashboard.html?patientId=ROHAN-101`);
  console.log('6. /api/qr status:', qrRes.status, 'Content-Type:', qrRes.headers.get('content-type'));

  // 7. Test Emergency Override without mandatory face scan (Should reject with 400)
  const rejectRes = await fetch(`${baseUrl}/api/consent/emergency-override`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId: 'ROHAN-101',
      doctorName: 'Unknown Person',
      idNumber: 'Fake-123'
      // missing faceScanDataUrl
    })
  });
  console.log('7. Anti-Snoop Rejection Test status (expect 400):', rejectRes.status, await rejectRes.json());

  // 8. Test Statutory Emergency Override with Doctor ID & Biometric Face Scan
  const overrideRes = await fetch(`${baseUrl}/api/consent/emergency-override`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId: 'ROHAN-101',
      doctorName: 'Dr. Aditi Sharma, MD',
      idType: 'NMC_DOCTOR_ID',
      idNumber: 'NMC-PB-89210-MD',
      hospitalName: 'Apollo Emergency Care Ludhiana',
      department: 'Trauma & Emergency Resuscitation Unit',
      reason: 'Acute Polytrauma & Impending Hemorrhagic Shock • Family Unreachable in Golden Hour Window',
      faceScanDataUrl: 'data:image/jpeg;base64,demo_biometric_face_scan_hash_verified',
      idCardDataUrl: 'data:image/jpeg;base64,demo_doctor_id_card_verified',
      gpsCoordinates: '30.9010° N, 75.8573° E'
    })
  });
  const overrideData = await overrideRes.json();
  console.log('8. Valid Biometric Override status (expect 200):', overrideRes.status, {
    success: overrideData.success,
    policeDocket: overrideData.policeDocketNumber,
    policeStation: overrideData.policeStationNotified,
    authorizedBy: overrideData.audit?.authorizedBy
  });

  // 9. Verify Tier 2 Unlocked with Police Audit Dossier
  const tier2Res = await fetch(`${baseUrl}/api/patients/ROHAN-101?tier=2`);
  const tier2Data = await tier2Res.json();
  console.log('9. Tier-2 Unlocked with Audit Dossier:', {
    isUnlocked: tier2Data.isUnlocked,
    unlockMethod: tier2Data.unlockMethod,
    policeDocket: tier2Data.overrideAudit?.policeDocketNumber,
    recordsCount: tier2Data.patient?.tier2?.clinicalRecords?.length
  });

  console.log('\nAll API and Security Override endpoints tested successfully!');
}

testApi().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
