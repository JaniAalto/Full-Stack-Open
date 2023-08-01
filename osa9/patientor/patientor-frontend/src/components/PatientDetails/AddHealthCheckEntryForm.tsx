import { useState, SyntheticEvent } from "react";
import { TextField, Button, Select, MenuItem, SelectChangeEvent, InputLabel } from '@mui/material';
import { HealthCheckRating, NewMedicalEntry } from "../../types";


interface Props {
  onSubmit: (values: NewMedicalEntry) => void;
};

const AddHealthCheckEntryForm = ({ onSubmit }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<string>>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(0);
  const healthRatings = [0, 1, 2, 3];


  const onRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "number") {
      const value = event.target.value;
      const rating = Object.values(HealthCheckRating).find(r => r === value);

      if (rating !== undefined) {
        setHealthCheckRating(rating as HealthCheckRating);
      }
    };
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    onSubmit({
      description,
      date,
      specialist,
      diagnosisCodes,
      healthCheckRating,
      type: 'HealthCheck'
    });
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <p><InputLabel>Date</InputLabel>
          <input type="date" value={date} onChange={(event) =>
            setDate(event.target.value)} /></p>
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <TextField
          label="Diagnosis codes"
          fullWidth
          value={diagnosisCodes}
          onChange={({ target }) => setDiagnosisCodes([target.value])}
        />
        <InputLabel>Health check rating</InputLabel>
        <Select
            fullWidth
            value={healthCheckRating.toString()}
            onChange={onRatingChange}
          >
          {healthRatings.map(rating =>
            <MenuItem
              key={rating}
              value={rating} >
              {rating}</MenuItem>
          )}
          </Select>
        <Button style={{ float: "left" }}
          type="submit"
          variant="contained">Add</Button>
      </form>
    </div>
  );
};


export default AddHealthCheckEntryForm;