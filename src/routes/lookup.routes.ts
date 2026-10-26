import { Router } from 'express';
import { lookupController } from '../controllers/lookup.controller';

const router = Router();

router.post('/vehicle', lookupController.lookupVehicle.bind(lookupController));
router.post('/biometric', lookupController.lookupBiometric.bind(lookupController));
router.get('/qr', lookupController.generateQr.bind(lookupController));

export default router;
