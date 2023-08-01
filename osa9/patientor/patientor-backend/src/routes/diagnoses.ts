import express from 'express';
import diagnosisService from '../services/diagnosisService';
import { Diagnosis } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  const diagnoses: Diagnosis[] = diagnosisService.getEntries();
  res.send(diagnoses);
});

router.post('/', (_req, res) => {
  res.send('Saving a diagnosis');
});

export default router;