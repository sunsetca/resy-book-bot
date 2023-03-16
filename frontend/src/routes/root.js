import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Outlet } from 'react-router-dom';

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://rip-resy.uc.r.appspot.com/">
          Rip Resy Bot
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

export default function Root(){

    return (
        <>
            <header className="header">
                <h1>RIP Resy</h1>
            </header>
            <div id="rip-resy-render">
                <Outlet/>
            </div>
            <Copyright/>
        </>
    );
};