"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = require("../controllers/patient.controller");
const router = (0, express_1.Router)();
router.get('/', patient_controller_1.patientController.getPatients.bind(patient_controller_1.patientController));
router.get('/:id', patient_controller_1.patientController.getPatientById.bind(patient_controller_1.patientController));
router.post('/reset', patient_controller_1.patientController.resetDemo.bind(patient_controller_1.patientController));
exports.default = router;
