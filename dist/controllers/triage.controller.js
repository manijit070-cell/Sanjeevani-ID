"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triageController = exports.TriageController = void 0;
const db_1 = require("../config/db");
const gemini_service_1 = require("../services/gemini.service");
const triage_service_1 = require("../services/triage.service");
const socket_service_1 = require("../services/socket.service");
class TriageController {
    async getAiTriage(req, res) {
        try {
            const { patientId } = req.body;
            const patient = await db_1.dbManager.getPatientById(patientId || 'ROHAN-101');
            if (!patient) {
                res.status(404).json({ success: false, message: 'Patient not found' });
                return;
            }
            const triage = await gemini_service_1.geminiService.generateRapidTriageBrief(patient);
            res.json({
                success: true,
                patientId: patient.id,
                triage
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    async checkDrug(req, res) {
        try {
            const { patientId, drugName } = req.body;
            if (!drugName) {
                res.status(400).json({ success: false, message: 'Drug name is required' });
                return;
            }
            const patient = await db_1.dbManager.getPatientById(patientId || 'ROHAN-101');
            if (!patient) {
                res.status(404).json({ success: false, message: 'Patient not found' });
                return;
            }
            const check = triage_service_1.triageService.evaluateDrugConflict(patient, drugName);
            res.json({
                success: true,
                patientId: patient.id,
                drugName,
                check
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    async initiateScan(req, res) {
        try {
            const { patientId, hospitalName, gpsLocation } = req.body;
            const patient = await db_1.dbManager.getPatientById(patientId || 'ROHAN-101');
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
            socket_service_1.socketService.broadcastErAlert(payload);
            res.json({
                success: true,
                message: 'Emergency dispatch broadcasted to family guardian phone via WebSockets',
                payload
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
exports.TriageController = TriageController;
exports.triageController = new TriageController();
