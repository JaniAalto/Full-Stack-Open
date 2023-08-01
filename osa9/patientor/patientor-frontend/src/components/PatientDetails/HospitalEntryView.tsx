import { Box } from '@mui/material';
import { Diagnosis, Entry } from "../../types";

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[]
}

const HospitalEntryView = ({ entry, diagnoses }: Props) => {

  if (entry.type === 'Hospital') {
    return (
      <Box sx={{ border: 1, p: 1 }}>
        <div key={entry.id}>
          [Hospital Care]
          <p><b>{entry.date}</b> — <i>{entry.description}</i></p>
          <div>Diagnosis by: {entry.specialist}</div>
          <div>Discharge: {entry.discharge.date} — {entry.discharge.criteria}</div>
          <ul>{entry.diagnosisCodes?.map(code =>
            <li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>
          )}</ul>
        </div>
      </Box>
    )
  }
}

export default HospitalEntryView