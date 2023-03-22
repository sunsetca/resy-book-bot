import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          R.I.P Reservation
        </Typography>
        <Button color="inherit" component={NavLink} to="/register" exact="true">
          Register
        </Button>
        <Button color="inherit" component={NavLink} to="/login" exact="true">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
