import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
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
import VenueSearchModal from './VenueSearchForm';
import { useErrorDialog, ErrorDialog } from '../ErrorDialog';

function ResyResRequestForm(){
  const today = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const [open, setOpen] = useState(false);
  const { errorDialogOpen, errorDialogMessage, handleErrorDialogOpen, setErrorDialogOpen } = useErrorDialog();
  const [partySize, setPartySize] = useState(1);
  const {venue, id} = useSelector((state) => state.venue);
  const { user, firebaseUID } = useSelector((state) => state.auth);
  const defaultValues = {resLiveDate: today, resDay: today, partySize: partySize.toString(), resTimes: [{resTime: subHours(today, today.getTimezoneOffset() / 60)}]};
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
    // setOpen(true);
    // skipping the attemmpt to open the modal and just going straight to rerouting to the venue search page
    navigate(`/user/${firebaseUID}/deep-link-venue/`);
  }
  const handleClose = () => {
    setOpen(false);
  }

  const onPartySizeChange = (e) => {
    setPartySize(parseInt(e.target.value));
  }


  const onSubmit = async (data) => {
    data.resLiveDate = data.resLiveDate.toISOString().slice(0, 19).replace('T', ' ');
    data.resDay = data.resDay.toISOString().slice(0, 10);
    data.venue_id = id;
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
    
    console.log(`attempting to create a reservation request for ${user.email} at ${venue} on ${data.reservationDate} at ${data.resTimes} for ${data.partySize} people`);
    await requestReservationTask(data)
      .then(() => navigate(`/user/${firebaseUID}`))
      .catch((err) => {
        let error_message = err.response.data['detail'];
        let error_message_string = '';
        for (const [key, value] of Object.entries(error_message)) {
          error_message_string += `${key.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: ${value} \n`;
        }
        handleErrorDialogOpen(error_message_string);
      });
  }
  

  
  return(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Date and time reservations go live:</Typography>
            <HookDateTimePicker {...registerState('resLiveDate')} rules={{required: true}} datePickerProps={{autoComplete: "date", autoFocus: true, margin: "normal", label: "Time that reservations go live", disablePast:true, sx: {marginTop: 1}}} fullWidth/>
          </Grid>
          <Grid item xs={12}>
            <HookDatePicker {...registerState('resDay')} rules={{required: true}} datePickerProps={{autoComplete: "date", autoFocus: true, margin: "normal", fullWidth: true, label: "Reservation Date", disablePast:true, sx: {marginTop: 1}}}/>
          </Grid>
          <Grid item xs={12}>
            <HookSelect {...registerState('partySize')} label="Party Size" rules={{required: true}} selectProps={{clearable: true, onChange: onPartySizeChange, sx: {marginTop:"0"}}} items={partySizeOptions}/>
          </Grid>
          <Grid item xs={12}>
            <Typography>Restaurant:</Typography>
            <HookTextField {...registerState('venue')} textFieldProps={{label: "Venue", value: venue ? venue : "Cafe Rosarito", disabled:true, sx: {marginTop: 1}}}/>
            <Button onClick={handleOpen}>Change venue</Button>
            
          </Grid>
          <VenueSearchModal open={open} handleClose={handleClose} partySize={partySize} />
          <Grid item xs={12}>
            <Typography variant="h6">Reservation Times in priority order</Typography>
            <ol name="res_times">
              { 
                fields.map((item, index) => {
                  return (
                    <li key={item.id}>
                      <HookTimePicker {...registerState(`resTimes.${index}.resTime`)} rules={{required: true}} timePickerProps={{autoComplete: "time", autoFocus: true, margin: "normal", fullWidth: true, label: "Reservation Time"}} gridProps={{xs: 15}} />
                      <Button onClick={() => fields.length > 1 ? remove(index) : handleErrorDialogOpen("Please have at least one timeslot selected for this reservation")}>Remove</Button>
                    </li>
                  );
                })
              }
            </ol>
            <ErrorDialog open={errorDialogOpen} setOpen={setErrorDialogOpen} dialogTitle={"Reservation Request form error"} dialogContent={errorDialogMessage} />
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