import { Router } from 'express';
import patientRoutes from './patient.routes';
import lookupRoutes from './lookup.routes';
import triageRoutes from './triage.routes';
import consentRoutes from './consent.routes';

const router = Router();

router.use('/patients', patientRoutes);
router.use('/lookup', lookupRoutes);
router.use('/ai', triageRoutes);
router.use('/er', triageRoutes);
router.use('/consent', consentRoutes);
router.post('/reset', (req, res) => {
  // Aliased to reset for backwards compatibility
  const { patientController } = require('../controllers/patient.controller');
  return patientController.resetDemo(req, res);
});

export default router;
