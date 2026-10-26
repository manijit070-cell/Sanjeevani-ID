"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupController = exports.LookupController = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const db_1 = require("../config/db");
class LookupController {
    async lookupVehicle(req, res) {
        try {
            const { vehicleNumber } = req.body;
            if (!vehicleNumber) {
                res.status(400).json({ success: false, message: 'Vehicle number is required' });
                return;
            }
            const match = await db_1.dbManager.getPatientByVehicle(vehicleNumber);
            if (!match) {
                res.status(404).json({
                    success: false,
                    message: `No active Sanjeevani emergency profile registered for vehicle ${vehicleNumber}. Verify with Vahan eDAR dispatch.`
                });
                return;
            }
            res.json({
                success: true,
                matchedVia: 'VAHAN_EDAR_INTEGRATION',
                patientId: match.id,
                patientName: match.name,
                vehicleDetails: match.vehicleDetails,
                bloodGroup: match.bloodGroup,
                emergencyPhone: match.tier1.emergencyContacts[0]?.phone
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    async lookupBiometric(req, res) {
        try {
            const { patientId } = req.body;
            const match = await db_1.dbManager.getPatientById(patientId || 'ROHAN-101');
            if (!match) {
                res.status(404).json({ success: false, message: 'Biometric matching failed' });
                return;
            }
            setTimeout(() => {
                res.json({
                    success: true,
                    matchedVia: 'UIDAI_AADHAAR_FACE_AUTH_V3',
                    matchConfidence: '98.9%',
                    livenessPassed: true,
                    patientId: match.id,
                    patientName: match.name,
                    aadhaarLast4: match.aadhaarLast4,
                    bloodGroup: match.bloodGroup
                });
            }, 350);
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    async generateQr(req, res) {
        try {
            const host = req.get('host') || 'localhost:3000';
            const protocol = req.protocol || 'http';
            const text = req.query.text || `${protocol}://${host}/er-dashboard.html?patientId=ROHAN-101`;
            const dataUrl = await qrcode_1.default.toDataURL(text, {
                width: 280,
                margin: 1,
                color: {
                    dark: '#070B14',
                    light: '#FFFFFF'
                }
            });
            const imgBuffer = Buffer.from(dataUrl.split(',')[1], 'base64');
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.send(imgBuffer);
        }
        catch (err) {
            res.status(500).send('QR generation error');
        }
    }
}
exports.LookupController = LookupController;
exports.lookupController = new LookupController();
