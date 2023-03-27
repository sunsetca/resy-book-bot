import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { HookDatePicker, HookDateTimePicker, HookSelect, HookTextField, HookTimePicker, useHookForm } from 'mui-react-hook-form-plus';
import { useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFieldArray } from 'react-hook-form';
import { subHours } from 'date-fns';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { requestReservationTask } from '../../backend';
import { useState } from 'react';
import VenueRequestForm from './VenueSearchForm';

function ResyResRequestForm(){
  const today = new Date()
  const [open, setOpen] = useState(false);
  const {venue, id} = useSelector((state) => state.venue);
  const { user, firebaseUID } = useSelector((state) => state.auth);
  const defaultValues = {resLiveDate: today, resDay: today, partySize: "1", resTimes: []};
  const { registerState, control, handleSubmit } = useHookForm({ defaultValues, });
  const navigate = useNavigate();
  const { fields, append, remove }  = useFieldArray({
    control,
    name: "resTimes"
  });
  
  const partySizeOptions = Array.from(Array(8).keys()).map((i) => {return {label: (i + 1).toString(), value: (i + 1).toString()}});
  const addTimeSelection = () => {
    append({resTime: subHours(today, today.getTimezoneOffset() / 60)});
  }
  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  const onSubmit = async (data) => {
    let email = user.email;
    data.resLiveDate = data.resLiveDate.toISOString().slice(0, 19).replace('T', ' ');
    data.resDay = data.resDay.toISOString().slice(0, 10);
    data.venue_id = 1000; // or would be the id variabe
    data.partySize = parseInt(data.partySize);
    data.uid = firebaseUID;
    data.resTimes = data.resTimes.map((resTime) => {
      const timezoneOffset = resTime.resTime.getTimezoneOffset() * 60 * 1000;
      const adjustedDate = new Date(resTime.resTime.getTime() - timezoneOffset);
      const timezoneOffsetSign = timezoneOffset > 0 ? '-' : '+';
      const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset / (60 * 60 * 1000))).toString().padStart(2, '0');
      const timezoneOffsetMinutes = Math.abs(Math.floor((timezoneOffset % (60 * 60 * 1000)) / (60 * 1000))).toString().padStart(2, '0');
      const timezoneOffsetString = `${timezoneOffsetSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
    
      return `${adjustedDate.toISOString().slice(11, 19)}${timezoneOffsetString}`;
    });
    
    console.log(`attempting to create a reservation request for ${email} at ${venue} on ${data.reservationDate} at ${data.resTimes} for ${data.partySize} people`);
    console.log(data);
    await requestReservationTask(data);
    navigate(`/user/${firebaseUID}`);
  }
  

  
  return(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={14}>
            <HookDateTimePicker {...registerState('resLiveDate')} rules={{required: true}} datePickerProps={{autoComplete: "date", autoFocus: true, margin: "normal", fullWidth: true, label: "Time that reservations go live", disablePast:true}}/>
          </Grid>
          <Grid item xs={12}>
            <HookDatePicker {...registerState('resDay')} rules={{required: true}} datePickerProps={{autoComplete: "date", autoFocus: true, margin: "normal", fullWidth: true, label: "Reservation Date", disablePast:true}}/>
          </Grid>
          <Grid item xs={12}>
            <HookSelect {...registerState('partySize')} label="Party Size" rules={{required: true}} selectProps={{clearable: true}} items={partySizeOptions}/>
          </Grid>
          <Grid item xs={12}>
            <HookTextField {...registerState('venue')} textFieldProps={{label: "Venue", value: venue ? venue : "Cafe Rosarito", disabled:true}}/>
            <Button onClick={handleOpen}>Change venue</Button>
            
          </Grid>
          <Modal open={open} onClose={handleClose} >
              <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
                <VenueRequestForm parentModalClose={handleClose}/>
              </Box>

            </Modal>
          <Grid item xs={12}>
            <Typography variant="h6">Reservation Times in priority order</Typography>
            <ol name="res_times">
              { 
                fields.map((item, index) => {
                  return (
                    <li key={item.id}>
                      <HookTimePicker {...registerState(`resTimes.${index}.resTime`)} rules={{required: true}} timePickerProps={{autoComplete: "time", autoFocus: true, margin: "normal", fullWidth: true, label: "Reservation Time"}} gridProps={{xs: 15}} />
                      <Button onClick={() => remove(index)}>Remove</Button>
                    </li>
                  );
                })
              }
            </ol>
            
          </Grid>
          { fields.length < 5 ? <Button onClick={addTimeSelection}>Add Time</Button> : null}
        </Grid>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}>
          Submit
        </Button>
      </form>
    </LocalizationProvider>
  );
};

export default ResyResRequestForm;