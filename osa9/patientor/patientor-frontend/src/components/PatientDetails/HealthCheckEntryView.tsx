import { Box } from '@mui/material';
import { Diagnosis, Entry } from "../../types";

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[]
}

const HealthCheckEntryView = ({ entry, diagnoses }: Props) => {
  if (entry.type === 'HealthCheck') {

    let healthRisk = "";
    switch (entry.healthCheckRating) {
      case 0:
        healthRisk = "Healthy";
        break;
      case 1:
        healthRisk = "Low risk";
        break;
      case 2:
        healthRisk = "High risk";
        break;
      case 3:
        healthRisk = "Critical risk";
        break;
    }

    return (
      <Box sx={{ border: 1, p: 1 }}>
        <div key={entry.id}>
          [Health Check]
          <p><b>{entry.date}</b> — <i>{entry.description}</i></p>
          <div>Diagnosis by: {entry.specialist}</div>
          <div>Health risk rating: {healthRisk}</div>
          <ul>{entry.diagnosisCodes?.map(code =>
            <li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>
          )}</ul>
        </div>
      </Box>
    )
  }
}

export default HealthCheckEntryView