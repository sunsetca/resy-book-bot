import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logout } from '../firebase';

const Navbar = () => {
  const {user} = useSelector((state) => state.auth);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          R.I.P Reservation
        </Typography>
        
        { user ? "" : <Button color="inherit" component={NavLink} to="/register" exact="true">Register</Button> }
        { user 
          ? 
            <Button color="inherit" onClick={logout} exact="true">Logout</Button>
          : 
            <Button color="inherit" component={NavLink} to="/login" exact="true">Login</Button>
        }
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
