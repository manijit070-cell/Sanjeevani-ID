"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const consent_controller_1 = require("../controllers/consent.controller");
const router = (0, express_1.Router)();
router.post('/approve', consent_controller_1.consentController.approveConsent.bind(consent_controller_1.consentController));
router.post('/override', consent_controller_1.consentController.emergencyOverride.bind(consent_controller_1.consentController));
router.post('/emergency-override', consent_controller_1.consentController.emergencyOverride.bind(consent_controller_1.consentController));
exports.default = router;
