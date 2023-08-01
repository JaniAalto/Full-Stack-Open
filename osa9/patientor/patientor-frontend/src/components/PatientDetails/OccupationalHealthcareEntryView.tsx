import { Box } from '@mui/material';
import { Diagnosis, Entry } from "../../types";

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[]
}

const OccupationalHealthcareEntryView = ({ entry, diagnoses }: Props) => {

  if (entry.type === 'OccupationalHealthcare') {
    return (
      <Box sx={{ border: 1, p: 1 }}>
        <div key={entry.id}>
          [Occupational Healthcare]
          <p><b>{entry.date}</b> — <i>{entry.description}</i></p>
          <div>Diagnosis by: {entry.specialist}</div>
          <div>Employer: {entry.employerName}</div>
          <div>Sick leave: {entry.sickLeave?.startDate} – {entry.sickLeave?.endDate}</div>
          <ul>{entry.diagnosisCodes?.map(code =>
            <li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>
          )}</ul>
        </div>
      </Box>
    )
  }
}

export default OccupationalHealthcareEntryView