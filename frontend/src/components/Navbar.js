import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logout } from '../firebase';
import { useDispatch } from 'react-redux';
import { saveUser, saveFirebaseUID, saveResyToken } from '../redux/authSlice';

const Navbar = () => {
  const { user, firebaseUID } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const logoutCurrentUser = async () => {
    await logout();
    dispatch(saveUser(null));
    dispatch(saveFirebaseUID(null));
    dispatch(saveResyToken(null));
    navigate('/');
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          R.I.P Reservation
        </Typography>
        
        { user ? <Button color="inherit" component={NavLink} to={`/user/${firebaseUID}`} exact="true">Profile</Button> : <Button color="inherit" component={NavLink} to="/register" exact="true">Register</Button> }
        { user 
          ? 
            <Button color="inherit" onClick={logoutCurrentUser} exact="true">Logout</Button>
          : 
            <Button color="inherit" component={NavLink} to="/login" exact="true">Login</Button>
        }
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
