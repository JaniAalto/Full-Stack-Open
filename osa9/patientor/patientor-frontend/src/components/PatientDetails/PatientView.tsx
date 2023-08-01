import { useParams } from 'react-router-dom'
import { useState, useEffect } from "react";
import { Alert, Stack } from '@mui/material';
import axios from 'axios';
import { Diagnosis, Entry, NewMedicalEntry, Patient } from "../../types";
import patientService from "../../services/patients";
import { getDiagnoses } from "../../services/diagnoses";
import HospitalEntryView from './HospitalEntryView';
import OccupationalHealthcareEntryView from './OccupationalHealthcareEntryView';
import HealthCheckEntryView from './HealthCheckEntryView';
import AddHospitalEntryForm from './AddHospitalEntryForm';
import AddOccupationalHCEntryForm from './AddOccupationalHCEntryForm';
import AddHealthCheckEntryForm from './AddHealthCheckEntryForm';


interface EntryProps {
  entry: Entry;
  diagnoses: Diagnosis[];
};

interface FormProps {
  entryForm: string;
  onSubmit: (entry: NewMedicalEntry) => void;
};

const EntryDetails = ({ entry, diagnoses }: EntryProps): JSX.Element => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryView key={entry.id} entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntryView key={entry.id} entry={entry} diagnoses={diagnoses} />;
    case 'HealthCheck':
      return <HealthCheckEntryView key={entry.id} entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  };
};

const EntryForm = ({ entryForm, onSubmit }: FormProps): JSX.Element => {
  switch (entryForm) {
    case 'Hospital':
      return <AddHospitalEntryForm onSubmit={onSubmit} />
    case 'OccupationalHealthcare':
      return <AddOccupationalHCEntryForm onSubmit={onSubmit} />
    case 'HealthCheck':
      return <AddHealthCheckEntryForm onSubmit={onSubmit} />
  };
  return <AddHospitalEntryForm onSubmit={onSubmit} />
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};


const PatientView = () => {
  const id = useParams().id as string;
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();
  const [error, setError] = useState('');
  const [entryForm, setEntryForm] = useState('Hospital');

  useEffect(() => {
    const fetchPatientList = async () => {
      const result = await patientService.getOne(id);
      setPatient(result);
    };
    const fetchDiagnosisList = async () => {
      const result = await getDiagnoses();
      setDiagnoses(result);
    };
    void fetchPatientList();
    void fetchDiagnosisList();
  }, [id]);

  const onSubmit = (entry: NewMedicalEntry) => {
    console.log("submitting entry");
    if (patient) {
      patientService.addEntry(id, entry).then(entry => {
        console.log("addEntry", entry);
        patient.entries.push(entry);
        setPatient(patient);
        setError("");
      }
      ).catch(error => {
        if (axios.isAxiosError(error)) {
          if (error?.response?.data && typeof error?.response?.data === "string") {
            console.log(error);
            setError(error.response.data);
          }
        }
      })
    }
  }

  if (patient && diagnoses) {
    let gender = "⚨";
    if (patient.gender.toString() === 'male')
      gender = "♂";
    if (patient.gender.toString() === 'female')
      gender = "♀";

    //console.log(patient, diagnoses);

    return (
      <div>
        <h2>{patient.name} {gender}</h2>
        <div>SSN: {patient.ssn}</div>
        <div>Occupation: {patient.occupation}</div>
        <br /><hr />
        <h2>Entries</h2>
        <div>{patient.entries.map(entry =>
          EntryDetails({ entry, diagnoses })
        )}</div>
        <br /><hr />
        <h2>Add new entry:</h2>
        {error && <Alert severity="error">{error}</Alert>}
        <Stack direction="row" spacing={3}>
          <div><input type="radio" name="entryForm" defaultChecked
            onChange={() => setEntryForm('Hospital')} />Hospital</div>
          <div><input type="radio" name="entryForm"
            onChange={() => setEntryForm('OccupationalHealthcare')} />Occupational HC</div>
          <div><input type="radio" name="entryForm"
            onChange={() => setEntryForm('HealthCheck')} />Healthcheck</div>
        </Stack><br />
        <EntryForm entryForm={entryForm} onSubmit={onSubmit} />
      </div>
    );
  };

  return <div>Loading...</div>;
};


export default PatientView;