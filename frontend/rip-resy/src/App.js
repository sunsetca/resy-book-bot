import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import './App.css';
import { RegistrationForm } from './components/Forms';

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

function App() {
  return (
    <div className="RIPRESY">
      <header className="RIPRESY-header"><h1>Welcome to RIP Resy</h1></header>
      <RegistrationForm/>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </div>
  );
}

export default App;
