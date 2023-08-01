import diagnosisData from '../../data/diagnoses';

import { Diagnosis } from '../types';

const diagnoses: Diagnosis[] = diagnosisData as Diagnosis[];

const getEntries = (): Diagnosis[] => {
  return diagnoses;
};

export default {
  getEntries
};