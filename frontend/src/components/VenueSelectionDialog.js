import { forwardRef, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { saveLatLon, saveVenue, saveVenueId } from '../redux/venueSlice';
import { Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function VenueSelectionDialog(props){
    const [selected, setSelected] = useState(null);
    const { firebaseUID } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleClose = () => {
      props.setOpen(false);
    };
    const handleNo = () => {
        props.setMapSearchClear(false);
        props.setSearch(true);
    };
    const handleYes = () => {
      props.parentModalClose(false);
      props.setOpen();
    };

    const handleSelection = () => {
      dispatch(saveLatLon({lat: selected.lat, lon: selected.lon}));
      dispatch(saveVenue(selected.name));
      dispatch(saveVenueId(selected.id));
      console.log(selected);
      props.setSearch(false);
      props.setOpen(false);
      props.parentModalClose();
    }

    return (
      <Dialog
        open={props.isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {props.isSearch ? (
          <>
          <DialogTitle>Search for restuarant</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography>If you are still unable to find the restaurant via search box please navigate <RouterLink to={`/user/${firebaseUID}/deep-link-venue`}>here</RouterLink></Typography>
            </DialogContentText>
            <Autocomplete
              id="select-restaurant"
              onChange={(event, newValue) => { setSelected(newValue) }}
              sx={{ marginTop: 1, width: 300 }}
              options={props.searchOptions}
              autoHighlight
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Restuarant name"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password'
                  }}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSelection}>Select</Button>
          </DialogActions>
        </>
        ) : (
          <>
            <DialogTitle>Is this the correct venue?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {props.venueName} in {props.venueNeighborhood} {props.venueSite}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNo}>No</Button>
              <Button onClick={handleYes}>Yes</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    );
}

export default VenueSelectionDialog;