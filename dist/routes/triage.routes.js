"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const triage_controller_1 = require("../controllers/triage.controller");
const router = (0, express_1.Router)();
router.post('/triage', triage_controller_1.triageController.getAiTriage.bind(triage_controller_1.triageController));
router.post('/drug-check', triage_controller_1.triageController.checkDrug.bind(triage_controller_1.triageController));
router.post('/initiate-scan', triage_controller_1.triageController.initiateScan.bind(triage_controller_1.triageController));
exports.default = router;
