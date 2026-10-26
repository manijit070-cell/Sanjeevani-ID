import { Router } from 'express';
import { patientController } from '../controllers/patient.controller';

const router = Router();

router.get('/', patientController.getPatients.bind(patientController));
router.get('/:id', patientController.getPatientById.bind(patientController));
router.post('/reset', patientController.resetDemo.bind(patientController));

export default router;
