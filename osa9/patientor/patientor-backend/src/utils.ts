import {
  Entry, Gender, NewMedicalEntry, NewPatientEntry, Diagnosis,
  HealthCheckRating, Discharge, SickLeave
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(param);
};

const parseName = (name: unknown): string => {
  if (name === "" || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date of birth: ' + date);
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (occupation === "" || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const parseSsn = (ssn: unknown): string => {
  if (ssn === "" || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn: ' + ssn);
  }
  return ssn;
};

const parseDescription = (description: unknown): string => {
  if (description === "" || !isString(description)) {
    throw new Error('Incorrect or missing description');
  }
  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (specialist === "" || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object') {
    //console.log("object", object)
    return [] as Array<Diagnosis['code']>;
  }
  return object as Array<Diagnosis['code']>;
};

const parseType = (type: unknown): ('Hospital' | 'OccupationalHealthcare' | 'HealthCheck') => {
  if (type !== 'Hospital')
    if (type !== 'OccupationalHealthcare')
      if (type !== 'HealthCheck') {
        //console.log("type", type)
        throw new Error('Incorrect or missing type');
      }
  return type;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || typeof discharge !== 'object' ||
    !('date' in discharge) || !('criteria' in discharge)) {
    throw new Error('Incorrect or missing discharge');
  }
  return discharge as Discharge;
};

const parseHealthCheck = (healthCheckRating: unknown): HealthCheckRating => {
  if (healthCheckRating === null || healthCheckRating === undefined
    || typeof healthCheckRating !== 'number') {
    throw new Error('Incorrect or missing healthCheckRating');
  }
  return healthCheckRating as HealthCheckRating;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (!sickLeave || typeof sickLeave !== 'object' ||
    !('startDate' in sickLeave) || !('endDate' in sickLeave)) {
    throw new Error('Incorrect or missing sickLeave');
  }
  return sickLeave as SickLeave;
};


export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'gender' in object &&
    'occupation' in object && 'ssn' in object && 'entries' in object) {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      ssn: parseSsn(object.ssn),
      entries: object.entries as Entry[]
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

export const toNewMedicalEntry = (object: unknown): NewMedicalEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }
  console.log("toNewMedicalEntry", object);

  if ('description' in object && 'date' in object && 'specialist' in object &&
    'diagnosisCodes' in object && 'type' in object) {

    let newEntry: NewMedicalEntry = {} as NewMedicalEntry;

    if ('discharge' in object) {
      newEntry = {
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
        type: parseType(object.type),
        discharge: parseDischarge(object.discharge)
      } as NewMedicalEntry;
    }
    if ('employerName' in object) {
      newEntry = {
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
        type: parseType(object.type),
        employerName: parseName(object.employerName)
      } as NewMedicalEntry;
      if ('sickLeave' in object)
        newEntry = { ...newEntry, sickLeave: parseSickLeave(object.sickLeave) } as NewMedicalEntry;
    }
    
    if ('healthCheckRating' in object) {
      newEntry = {
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
        type: parseType(object.type),
        healthCheckRating: parseHealthCheck(object.healthCheckRating)
      } as NewMedicalEntry;
    }

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};