"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lookup_controller_1 = require("../controllers/lookup.controller");
const router = (0, express_1.Router)();
router.post('/vehicle', lookup_controller_1.lookupController.lookupVehicle.bind(lookup_controller_1.lookupController));
router.post('/biometric', lookup_controller_1.lookupController.lookupBiometric.bind(lookup_controller_1.lookupController));
router.get('/qr', lookup_controller_1.lookupController.generateQr.bind(lookup_controller_1.lookupController));
exports.default = router;
