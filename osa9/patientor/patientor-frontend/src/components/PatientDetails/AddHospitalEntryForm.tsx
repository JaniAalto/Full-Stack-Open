import { useState, SyntheticEvent } from "react";
import { TextField, Button, InputLabel } from '@mui/material';
import { NewMedicalEntry } from "../../types";


interface Props {
  onSubmit: (values: NewMedicalEntry) => void;
}

const AddHospitalEntryForm = ({ onSubmit }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<string>>([]);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');


  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const discharge = { date: dischargeDate, criteria: dischargeCriteria }

    onSubmit({
      description,
      date,
      specialist,
      diagnosisCodes,
      discharge: discharge,
      type: 'Hospital'
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
        <p><InputLabel>Discharge date</InputLabel>
          <input type="date" value={dischargeDate} onChange={(event) =>
            setDischargeDate(event.target.value)} /></p>
        <TextField
          label="Discharge criteria"
          fullWidth
          value={dischargeCriteria}
          onChange={({ target }) => setDischargeCriteria(target.value)}
        />
        <Button style={{ float: "left" }}
          type="submit"
          variant="contained">Add</Button>
      </form>
    </div>
  );
};


export default AddHospitalEntryForm;