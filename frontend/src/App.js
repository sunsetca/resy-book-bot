import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import './App.css';
import { WrappedRegistrationForm, WrappedSignInForm } from './components/forms/FormContainer';

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
        <header className="header"><h1>RIP Resy</h1></header>
        <WrappedRegistrationForm/>
        <WrappedSignInForm/>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </div>
  );
};

export default App;
