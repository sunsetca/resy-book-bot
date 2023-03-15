import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { defaultTheme } from '../defaultTheme';


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
        }}
      >
        {props.children}
      </Box>
  </Container>
  );
}

function RegistrationForm(){
  const handleSubmit = (data) => {
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    // send response to firebase and process cookies and save in session storage
  };
  return (
  <FormContainer>
    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
      <AssignmentIndOutlinedIcon/>
    </Avatar>
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 4 }}>
      <Grid container spacing={2}>
      <Grid item xs={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="first_name"
            autoComplete="given-name"
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
          />
        </Grid>
        <Grid item xs={12}>
        <TextField 
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          fullWidth
          required
          id="phoneNumber"
          label="Phone Number"
          name="phone_number"
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}>
        Register
      </Button>
    </Box>
  </FormContainer>
  );
}

function SignInForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    // send response to firebase and process cookies and save in session storage
  };

  return (
      <FormContainer>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </FormContainer>
  );
}


function ResyTokenForm(){
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    // send response to firebase and process cookies and save in session storage
  };
  return( 
  <FormContainer>
    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
      <KeyOutlinedIcon/>
    </Avatar>
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="resy_token"
            label="Resy Auth Token"
            type="password"
            id="resy_token"
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Box>
  </FormContainer>
  );
}

function ResySearchForm(){}

function ResyResRequestForm(){
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    // send response to firebase and process cookies and save in session storage
  };
  return(
    <FormContainer>
      <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
      <LaptopChromebookOutlinedIcon/>
    </Avatar>
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="resy_token"
            label="Resy Auth Token"
            type="password"
            id="resy_token"
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Box>
    </FormContainer>
  )
}

export {
  SignInForm,
  RegistrationForm,
  ResyTokenForm,
  ResyResRequestForm
}