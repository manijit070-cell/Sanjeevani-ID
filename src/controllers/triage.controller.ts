import { Request, Response } from 'express';
import { dbManager } from '../config/db';
import { geminiService } from '../services/gemini.service';
import { triageService } from '../services/triage.service';
import { socketService } from '../services/socket.service';

export class TriageController {
  public async getAiTriage(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.body;
      const patient = await dbManager.getPatientById(patientId || 'ROHAN-101');

      if (!patient) {
        res.status(404).json({ success: false, message: 'Patient not found' });
        return;
      }

      const triage = await geminiService.generateRapidTriageBrief(patient);
      res.json({
        success: true,
        patientId: patient.id,
        triage
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public async checkDrug(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, drugName } = req.body;
      if (!drugName) {
        res.status(400).json({ success: false, message: 'Drug name is required' });
        return;
      }

      const patient = await dbManager.getPatientById(patientId || 'ROHAN-101');
      if (!patient) {
        res.status(404).json({ success: false, message: 'Patient not found' });
        return;
      }

      const check = triageService.evaluateDrugConflict(patient, drugName);
      res.json({
        success: true,
        patientId: patient.id,
        drugName,
        check
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public async initiateScan(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, hospitalName, gpsLocation } = req.body;
      const patient = await dbManager.getPatientById(patientId || 'ROHAN-101');

      if (!patient) {
        res.status(404).json({ success: false, message: 'Patient not found' });
        return;
      }

      const payload = {
        patientId: patient.id,
        patientName: patient.name,
        age: patient.age,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        hospitalName: hospitalName || "Apollo Hospital Ludhiana (Trauma Level-1)",
        gpsLocation: gpsLocation || "30.9010° N, 75.8573° E",
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        primaryContact: patient.tier1.emergencyContacts[0]
      };

      // Real-time broadcast to family devices
      socketService.broadcastErAlert(payload);

      res.json({
        success: true,
        message: 'Emergency dispatch broadcasted to family guardian phone via WebSockets',
        payload
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export const triageController = new TriageController();
