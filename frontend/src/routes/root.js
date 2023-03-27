import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://rip-resy.uc.r.appspot.com/">
          R.I.P Reservation Bot
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

export default function Root(){

    return (
        <>
          <Navbar/>
          <Outlet/>
          <Copyright/>
        </>
    );
};