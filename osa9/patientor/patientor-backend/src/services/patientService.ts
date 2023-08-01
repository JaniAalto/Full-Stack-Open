import { v1 as uuid } from 'uuid';
import patientData from '../../data/patients';
import { NewPatientEntry, Patient, SensitivePatientEntry, NewMedicalEntry } from '../types';

const patients: Patient[] = patientData;

const getEntries = (): Patient[] => {
  return patients;
};

const getReducedEntries = (): SensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const findOne = (id: string): Patient | undefined => {
  const entry = patients.find(p => p.id === id);
  console.log("found entry", entry);
  return entry;
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const id: string = uuid();
  const newPatientEntry = {
    id: id,
    ...entry
  };
  //console.log("newPatientEntry", newPatientEntry);

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patientId: string, entry: NewMedicalEntry): NewMedicalEntry => {
  const entryId: string = uuid();
  const newEntry = {
    id: entryId,
    ...entry
  };
  //console.log("newEntry", newEntry);

  const patient = patients.find(p => p.id === patientId);
  if (patient) {
    patient.entries.push(newEntry);
  }

  return newEntry;
};

export default {
  getEntries,
  getReducedEntries,
  findOne,
  addPatient,
  addEntry
};