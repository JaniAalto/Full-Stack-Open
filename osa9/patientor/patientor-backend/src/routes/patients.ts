import express from 'express';
import patientService from '../services/patientService';
import { SensitivePatientEntry } from '../types';
import { toNewPatientEntry, toNewMedicalEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients: SensitivePatientEntry[] = patientService.getReducedEntries();
  //console.log("patients", patients);
  res.send(patients);
});

router.get('/:id', (req, res) => {
  const patient = patientService.findOne(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = patientService.addPatient(newPatientEntry);
    //console.log("addedEntry", addedEntry);
    res.json(addedEntry);
  }
  catch (error: unknown) {
    let errorMessage = "Something went wrong";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const patient = patientService.findOne(req.params.id);
    if (patient) {
      const newEntry = toNewMedicalEntry(req.body);
      console.log("newEntry", newEntry);

      const addedEntry = patientService.addEntry(patient.id, newEntry);
      console.log("addedEntry", addedEntry);
      
      res.json(addedEntry);
    }
  }
  catch (error: unknown) {
    let errorMessage = "Something went wrong";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;