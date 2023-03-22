import Avatar from '@mui/material/Avatar';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import RegistrationForm from './RegistrationForm';
import ResyResRequestForm from './ResyResRequestForm';
import ResyTokenForm from './ResyTokenForm';
import Login, { LoginWithOtherProviders } from './LoginForm';
import { Divider } from '@mui/material';



function FormContainer(props){
  let activeDivider;

  if (props.leftChild) {
    activeDivider = <Divider flexItem={true}>OR</Divider>
  }

  return(
    <Container component="main" maxWidth="xs">
      <Box
          sx={{
          marginTop: 5,
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
          {props.leftChild}
          {activeDivider}
          {props.form}
          
      </Box>

    </Container>
  );
}

const WrappedRegistrationForm = () => {
  return <FormContainer avatar={<AssignmentIndOutlinedIcon/>} form={<RegistrationForm/>} leftChild={<LoginWithOtherProviders action="Sign up"/>}/>
}

const WrappedResyResRequestForm = () => {
  return <FormContainer avatar={<LaptopChromebookOutlinedIcon/>} typography="Reservation Snipe Request" form={<ResyResRequestForm/>}/>
}

const WrappedResyTokenForm = () => {
  return <FormContainer avatar={<KeyOutlinedIcon/>} typography="Register Resy Auth Token" form={<ResyTokenForm/>}/>
}

const WrappedSignInForm = () => {
  return <FormContainer avatar={<LockOutlinedIcon/>} form={<Login/>} leftChild={<LoginWithOtherProviders action="Login"/>}/>
}

  export {
  WrappedRegistrationForm,
  WrappedResyResRequestForm,
  WrappedResyTokenForm,
  WrappedSignInForm
}