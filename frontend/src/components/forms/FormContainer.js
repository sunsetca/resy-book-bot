import Avatar from '@mui/material/Avatar';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { defaultTheme } from '../../defaultTheme';
import RegistrationForm from './RegistrationForm';
import ResyResRequestForm from './ResyResRequestForm';
import ResyTokenForm from './ResyTokenForm';
import SignInForm from './SignInForm';


const theme = createTheme(defaultTheme);

function FormContainer(props){
  return(
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
          sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          }}>
        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
          {props.avatar}
        </Avatar>
        <Typography component="h1" variant="h5">
            {props.typography}
        </Typography>
        {props.form}
      </Box>
    </Container>
  );
}

const WrappedRegistrationForm = () => {
  return <FormContainer avatar={<AssignmentIndOutlinedIcon/>} typography="Register" form={<RegistrationForm/>}/>
}

const WrappedResyResRequestForm = () => {
  return <FormContainer avatar={<LaptopChromebookOutlinedIcon/>} typography="Reservation Snipe Request" form={<ResyResRequestForm/>}/>
}

const WrappedResyTokenForm = () => {
  return <FormContainer avatar={<KeyOutlinedIcon/>} typography="Register Resy Auth Token" form={<ResyTokenForm/>}/>
}

const WrappedSignInForm = () => {
  return <FormContainer avatar={<LockOutlinedIcon/>} typography="Sign In" form={<SignInForm/>}/>
}

  export {
  WrappedRegistrationForm,
  WrappedResyResRequestForm,
  WrappedResyTokenForm,
  WrappedSignInForm
}