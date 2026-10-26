import { Router } from 'express';
import { triageController } from '../controllers/triage.controller';

const router = Router();

router.post('/triage', triageController.getAiTriage.bind(triageController));
router.post('/drug-check', triageController.checkDrug.bind(triageController));
router.post('/initiate-scan', triageController.initiateScan.bind(triageController));

export default router;
