"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientController = exports.PatientController = void 0;
const db_1 = require("../config/db");
const socket_service_1 = require("../services/socket.service");
class PatientController {
    async getPatients(req, res) {
        try {
            const patients = await db_1.dbManager.getAllPatients();
            const summaries = patients.map(p => ({
                id: p.id,
                name: p.name,
                age: p.age,
                gender: p.gender,
                bloodGroup: p.bloodGroup,
                bloodGroupRarity: p.bloodGroupRarity,
                vehicleNumber: p.vehicleNumber,
                vehicleDetails: p.vehicleDetails,
                city: p.city,
                avatar: p.avatar,
                isUnlocked: p.tier2.unlocked
            }));
            res.json({
                success: true,
                count: summaries.length,
                isMongo: db_1.dbManager.isMongoActive(),
                patients: summaries
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    async getPatientById(req, res) {
        try {
            const id = String(req.params.id);
            const patient = await db_1.dbManager.getPatientById(id);
            if (!patient) {
                res.status(404).json({ success: false, message: 'Patient not found in Sanjeevani registry' });
                return;
            }
            const requestedTier = parseInt(req.query.tier, 10) || 1;
            if (requestedTier === 1 || !patient.tier2.unlocked) {
                // Tier 1 life-saving response (Deep records masked)
                res.json({
                    success: true,
                    tierLevel: 1,
                    isUnlocked: patient.tier2.unlocked,
                    unlockMethod: patient.tier2.unlockMethod,
                    patient: {
                        id: patient.id,
                        name: patient.name,
                        age: patient.age,
                        gender: patient.gender,
                        bloodGroup: patient.bloodGroup,
                        bloodGroupRarity: patient.bloodGroupRarity,
                        avatar: patient.avatar,
                        phone: patient.phone,
                        aadhaarLast4: patient.aadhaarLast4,
                        abHaNumber: patient.abHaNumber,
                        vehicleNumber: patient.vehicleNumber,
                        vehicleDetails: patient.vehicleDetails,
                        city: patient.city,
                        tier1: patient.tier1,
                        tier2Preview: {
                            isLocked: !patient.tier2.unlocked,
                            availableRecordsCount: patient.tier2.clinicalRecords.length,
                            insuranceAvailable: true,
                            notice: "Detailed hospital discharge summaries, 12-lead ECG strips, PM-RAHAT cashless claim token, and Star Health cashless pre-auth are locked pending Remote Family Guardian authorization."
                        }
                    }
                });
                return;
            }
            // Tier 2 fully unlocked response
            res.json({
                success: true,
                tierLevel: 2,
                isUnlocked: true,
                unlockMethod: patient.tier2.unlockMethod,
                unlockedAt: patient.tier2.unlockedAt,
                consentToken: patient.tier2.consentToken,
                digitalSignature: patient.tier2.digitalSignature,
                overrideAudit: patient.tier2.overrideAudit || null,
                patient: patient
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    async resetDemo(req, res) {
        try {
            await db_1.dbManager.resetDemoState();
            socket_service_1.socketService.broadcastReset();
            res.json({ success: true, message: 'Sanjeevani-ID demo state reset successfully' });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
exports.PatientController = PatientController;
exports.patientController = new PatientController();
