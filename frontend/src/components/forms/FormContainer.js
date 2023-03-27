import Avatar from '@mui/material/Avatar';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import LinkIcon from '@mui/icons-material/Link';
import { Divider } from '@mui/material';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import RegistrationForm from './RegistrationForm';
import ResyResRequestForm from './ResyResRequestForm';
import ResyTokenForm from './ResyTokenForm';
import PasswordResetForm from './PasswordResetForm';
import VenueRequestForm from './VenueSearchForm';
import RegisterVenueForm from './RegisterVenueForm';
import Login, { LoginWithOtherProviders } from './LoginForm';
import { AuthTokenHowTo, VenueIdHowTo } from '../HowTo';


function FormContainer(props){
  let activeDivider;

  if (props.leftChild) {
    if (props.callToAction) {
      activeDivider = <Divider flexItem={true} sx={{marginTop: 2}}>{props.callToAction}</Divider> 
    } else {
      activeDivider = <Divider flexItem={true} sx={{marginTop: 2}}/>
    }
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
          <Avatar sx={{m: 1}}>
            {props.avatar}
          </Avatar>
          <Typography component="h1" variant="h5" sx={{marginBottom: 3}}>
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
  return <FormContainer avatar={<AssignmentIndOutlinedIcon/>} form={<RegistrationForm/>} leftChild={<LoginWithOtherProviders action="Sign up"/>} callToAction="OR"/>
}

const WrappedResyResRequestForm = () => {
  return <FormContainer avatar={<LaptopChromebookOutlinedIcon/>} typography="Reservation Snipe Request" form={<ResyResRequestForm/>}/>
}

const WrappedResyTokenForm = () => {
  return <FormContainer avatar={<KeyOutlinedIcon/>} typography="Register Resy Auth Token" form={<ResyTokenForm/>} leftChild={<AuthTokenHowTo/>}/>
}

const WrappedSignInForm = () => {
  return <FormContainer avatar={<LockOutlinedIcon/>} form={<Login/>} leftChild={<LoginWithOtherProviders action="Login"/>} callToAction="OR"/>
}

const WrappedPasswordResetForm = () => {
  return <FormContainer avatar={<LockResetIcon/>} typography="Reset password" form={<PasswordResetForm/>}/>
}

const WrappedVenueSearchForm = () => {
  return <FormContainer avatar={<LocationSearchingIcon/>} typography="Find venue" form={<VenueRequestForm/>}/>
}

const WrappedRegisterVenueForm = () => {
  return <FormContainer avatar={<LinkIcon/>} typography="Register venue" form={<RegisterVenueForm/>} leftChild={<VenueIdHowTo/>}/>
}

export {
  WrappedRegistrationForm,
  WrappedResyResRequestForm,
  WrappedRegisterVenueForm,
  WrappedResyTokenForm,
  WrappedSignInForm,
  WrappedPasswordResetForm,
  WrappedVenueSearchForm,
}