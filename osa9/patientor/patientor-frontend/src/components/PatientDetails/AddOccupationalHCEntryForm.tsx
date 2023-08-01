import { useState, SyntheticEvent } from "react";
import { TextField, Button, InputLabel } from '@mui/material';
import { NewMedicalEntry } from "../../types";


interface Props {
  onSubmit: (values: NewMedicalEntry) => void;
};

const AddOccupationalHCEntryForm = ({ onSubmit }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<string>>([]);
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');


  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const sickLeave = { startDate: sickLeaveStart, endDate: sickLeaveEnd };

    onSubmit({
      description,
      date,
      specialist,
      diagnosisCodes,
      employerName: employerName,
      sickLeave: sickLeave,
      type: 'OccupationalHealthcare'
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
        <TextField
          label="Employer"
          fullWidth
          value={employerName}
          onChange={({ target }) => setEmployerName(target.value)}
        />
        <p><InputLabel>Sick leave start</InputLabel>
          <input type="date" value={sickLeaveStart} onChange={(event) =>
            setSickLeaveStart(event.target.value)} /></p>
        <p><InputLabel>Sick leave end</InputLabel>
          <input type="date" value={sickLeaveEnd} onChange={(event) =>
            setSickLeaveEnd(event.target.value)} /></p>
        <Button style={{ float: "left" }}
          type="submit"
          variant="contained">Add</Button>
      </form>
    </div>
  );
};


export default AddOccupationalHCEntryForm;