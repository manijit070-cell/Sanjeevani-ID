"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_routes_1 = __importDefault(require("./patient.routes"));
const lookup_routes_1 = __importDefault(require("./lookup.routes"));
const triage_routes_1 = __importDefault(require("./triage.routes"));
const consent_routes_1 = __importDefault(require("./consent.routes"));
const router = (0, express_1.Router)();
router.use('/patients', patient_routes_1.default);
router.use('/lookup', lookup_routes_1.default);
router.use('/ai', triage_routes_1.default);
router.use('/er', triage_routes_1.default);
router.use('/consent', consent_routes_1.default);
router.post('/reset', (req, res) => {
    // Aliased to reset for backwards compatibility
    const { patientController } = require('../controllers/patient.controller');
    return patientController.resetDemo(req, res);
});
exports.default = router;
