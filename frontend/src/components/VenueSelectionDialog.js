import { forwardRef, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { saveLatLong } from '../redux/venueSlice';
import { useNavigate } from "react-router-dom";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function VenueSelectionDialog(props){
    const { firebaseUID } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClose = () => {
      props.setOpen(false);
    };
    const handleNo = () => {
        dispatch(saveLatLong({lat: null, lng: null}));
        props.setOpen(false);
    };
    const handleYes = () => {
      navigate(`user/${firebaseUID}/resy-res-request/`);
    };

    return (
      <Dialog 
        open={props.isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description">
          <DialogTitle>Is this the correct venue?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">{props.venueName} : {props.venueLink}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNo}>No</Button>
            <Button onClick={handleYes}>Yes</Button>
          </DialogActions>
        </Dialog>
    );
}

export default VenueSelectionDialog;