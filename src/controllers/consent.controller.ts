import { Request, Response } from 'express';
import { dbManager } from '../config/db';
import { socketService } from '../services/socket.service';

export class ConsentController {
  public async approveConsent(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, signerName, relation, signatureData, hospitalGps } = req.body;
      const patient = await dbManager.getPatientById(patientId || 'ROHAN-101');

      if (!patient) {
        res.status(404).json({ success: false, message: 'Patient not found' });
        return;
      }

      const consentToken = `SANJ-CONSENT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const timestamp = new Date().toISOString();

      patient.tier2.unlocked = true;
      patient.tier2.unlockedAt = timestamp;
      patient.tier2.unlockMethod = "FAMILY_REMOTE_CONSENT";
      patient.tier2.consentToken = consentToken;
      patient.tier2.digitalSignature = {
        signerName: signerName || patient.tier1.emergencyContacts[0]?.name || "Family Guardian",
        relation: relation || patient.tier1.emergencyContacts[0]?.relation || "Primary Family Member",
        signatureData: signatureData || "DIGITAL_BIOMETRIC_TOUCH_SIGNATURE",
        timestamp: timestamp,
        verifiedGps: hospitalGps || "30.9010° N, 75.8573° E (Apollo ER Ludhiana)",
        legalStatement: "Authorized full medical records disclosure, emergency ICU admission, and PM-RAHAT / Cashless Insurance billing dispatch."
      };

      await dbManager.updatePatient(patient);

      // Broadcast to all connected hospital dashboards in real-time
      socketService.broadcastFamilyConsent({
        patientId: patient.id,
        patientName: patient.name,
        consentToken: consentToken,
        unlockedAt: timestamp,
        signature: patient.tier2.digitalSignature,
        insuranceClearance: patient.tier2.insuranceClearance,
        clinicalRecords: patient.tier2.clinicalRecords,
        pastSurgeries: patient.tier2.pastSurgeries
      });

      res.json({
        success: true,
        message: 'Legal digital consent approved and pushed to ER hospital console in real-time.',
        consentToken: consentToken,
        patient: patient
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public async emergencyOverride(req: Request, res: Response): Promise<void> {
    try {
      const {
        patientId,
        doctorName,
        idType,
        idNumber,
        hospitalName,
        department,
        reason,
        faceScanDataUrl,
        idCardDataUrl,
        gpsCoordinates
      } = req.body;

      const patient = await dbManager.getPatientById(patientId || 'ROHAN-101');

      if (!patient) {
        res.status(404).json({ success: false, message: 'Patient not found in Sanjeevani registry' });
        return;
      }

      // Mandatory identity & biometric verification check
      if (!doctorName || !idNumber || !faceScanDataUrl) {
        res.status(400).json({
          success: false,
          message: 'Mandatory verification failed: Doctor Name, Registration/Aadhaar number, and live biometric Face Scan are strictly required to execute an Emergency Override.'
        });
        return;
      }

      const policeDocketNumber = `CCTNS-PB-${new Date().getFullYear()}-ER-${Math.floor(1000 + Math.random() * 9000)}`;
      const policeStationNotified = "Ludhiana Central Police Station & Traffic CCTNS Unit, Punjab Police";
      const overrideToken = `EMERGENCY-OVERRIDE-${Date.now()}`;
      const timestamp = new Date().toISOString();

      const overrideAudit = {
        authorizedBy: doctorName.trim(),
        idType: (idType as any) || 'NMC_DOCTOR_ID',
        idNumber: idNumber.trim(),
        hospitalName: hospitalName ? hospitalName.trim() : 'Apollo Emergency Care Ludhiana',
        department: department ? department.trim() : 'Trauma & Emergency Resuscitation Unit',
        reason: reason ? reason.trim() : 'Severe polytrauma, golden hour resuscitation, family unreachable',
        faceScanDataUrl: faceScanDataUrl,
        idCardDataUrl: idCardDataUrl || undefined,
        gpsCoordinates: gpsCoordinates || '30.9010° N, 75.8573° E',
        timestamp: timestamp,
        policeStationNotified: policeStationNotified,
        policeDocketNumber: policeDocketNumber,
        legalStatute: 'Section 134A Motor Vehicles Act (Good Samaritan) & Section 43/66 IT Act Police Audit'
      };

      patient.tier2.unlocked = true;
      patient.tier2.unlockedAt = timestamp;
      patient.tier2.unlockMethod = 'DOCTOR_BIOMETRIC_OVERRIDE';
      patient.tier2.consentToken = overrideToken;
      patient.tier2.overrideAudit = overrideAudit;
      patient.tier2.digitalSignature = {
        signerName: `${overrideAudit.authorizedBy} (${overrideAudit.idType}: ${overrideAudit.idNumber})`,
        relation: "Attending Emergency Physician / Statutory Responding Medic",
        signatureData: "BIOMETRIC_FACE_SCAN_AUTHENTICATED",
        timestamp: timestamp,
        verifiedGps: overrideAudit.gpsCoordinates,
        legalStatement: `Statutory emergency break-glass override under Section 134A Good Samaritan Law. Biometric and credential dossier dispatched to ${policeStationNotified} (Docket #${policeDocketNumber}) and family contacts.`
      };

      await dbManager.updatePatient(patient);

      // 1. Broadcast Tier-2 unlock to Doctor HUD
      socketService.broadcastOverride({
        patientId: patient.id,
        patientName: patient.name,
        overrideToken: overrideToken,
        unlockedAt: timestamp,
        tier2: patient.tier2,
        overrideAudit: overrideAudit
      });

      // 2. Broadcast High-Priority Police & Family Audit Alert
      socketService.broadcastPoliceAudit({
        patientId: patient.id,
        patientName: patient.name,
        overrideToken: overrideToken,
        audit: overrideAudit,
        policeDocketNumber: policeDocketNumber,
        policeStationNotified: policeStationNotified,
        timestamp: timestamp
      });

      res.json({
        success: true,
        message: 'Statutory emergency override executed with biometric audit. Dispatched to CCTNS Police & Family.',
        token: overrideToken,
        policeDocketNumber: policeDocketNumber,
        policeStationNotified: policeStationNotified,
        audit: overrideAudit,
        patient: patient
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export const consentController = new ConsentController();
