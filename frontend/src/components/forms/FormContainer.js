import Avatar from '@mui/material/Avatar';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import LinkIcon from '@mui/icons-material/Link';
import BugIcon from '@mui/icons-material/BugReportOutlined';
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
import BugReportForm from './BugReportForm';
import Login, { LoginWithOtherProviders } from './LoginForm';
import { AuthTokenHowTo, VenueIdHowTo } from '../HowTo';
import { ProtectedRoute } from '../ProtectedRoute';


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
  return <FormContainer avatar={<AssignmentIndOutlinedIcon/>} form={<RegistrationForm/>}/>
}

const WrappedResyResRequestForm = () => {
  const ProtectedResyResRequestForm = ProtectedRoute(ResyResRequestForm);
  return <FormContainer avatar={<LaptopChromebookOutlinedIcon/>} typography="Reservation Snipe Request" form={<ProtectedResyResRequestForm/>}/>
}

const WrappedResyTokenForm = () => {
  const ProtectedResyTokenForm = ProtectedRoute(ResyTokenForm);
  return <FormContainer avatar={<KeyOutlinedIcon/>} typography="Register Resy Auth Token" form={<ProtectedResyTokenForm/>} leftChild={<AuthTokenHowTo/>}/>
}

const WrappedSignInForm = () => {
  return <FormContainer avatar={<LockOutlinedIcon/>} form={<Login/>}/>
}

const WrappedPasswordResetForm = () => {
  return <FormContainer avatar={<LockResetIcon/>} typography="Reset password" form={<PasswordResetForm/>}/>
}

const WrappedVenueSearchForm = () => {
  const ProtectedVenueRequestForm = ProtectedRoute(VenueRequestForm);
  return <FormContainer avatar={<LocationSearchingIcon/>} typography="Find venue" form={<ProtectedVenueRequestForm/>}/>
}

const WrappedRegisterVenueForm = () => {
  const ProtectedRegisterVenueForm = ProtectedRoute(RegisterVenueForm);
  return <FormContainer avatar={<LinkIcon/>} typography="Register venue" form={<ProtectedRegisterVenueForm/>} leftChild={<VenueIdHowTo/>}/>
}

const WrappedBugReportForm = () => {
  const ProtectedBugReportForm = ProtectedRoute(BugReportForm);
  return <FormContainer avatar={<BugIcon />} typography="Report a bug" form={<ProtectedBugReportForm />} />;
};


export {
  WrappedBugReportForm,
  WrappedRegistrationForm,
  WrappedResyResRequestForm,
  WrappedRegisterVenueForm,
  WrappedResyTokenForm,
  WrappedSignInForm,
  WrappedPasswordResetForm,
  WrappedVenueSearchForm,
}