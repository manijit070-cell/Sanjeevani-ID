import { Router } from 'express';
import { consentController } from '../controllers/consent.controller';

const router = Router();

router.post('/approve', consentController.approveConsent.bind(consentController));
router.post('/override', consentController.emergencyOverride.bind(consentController));
router.post('/emergency-override', consentController.emergencyOverride.bind(consentController));

export default router;
