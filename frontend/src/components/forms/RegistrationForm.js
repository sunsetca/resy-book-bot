import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { registerEmailPassword, signInWithGoogle } from '../../firebase';
import { HookTextField, useHookForm } from 'mui-react-hook-form-plus';

const RegistrationForm = () => {
  const defaultValues = { email: '', password: '', firstName: '', phoneNumber: ''};
  const { registerState, handleSubmit } = useHookForm({ defaultValues, });

  const onSubmit = (data) => {
    console.log(data)
    // send response to firebase and process tokens and save in session storage
    registerEmailPassword(data.email, data.password, data.firstName, data.phoneNumber).then(async (user) => {
      let userFirebaseSession = await user.getIdToken();
      localStorage.setItem('firebaseSession', userFirebaseSession)
    });
    // load user profile
  };
  return (
      <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <HookTextField {...registerState('email')} textFieldProps={{autoComplete: "email", autoFocus: true, margin: "normal", fullWidth: true, label: "Email"}}/>
              </Grid>
              <Grid item xs={12}>
                <HookTextField {...registerState('password')} textFieldProps={{autoComplete: "new-password", autoFocus: true, margin: "normal", fullWidth: true, label: "Password", type: "password"}}/>
              </Grid>
              <Grid item xs={12}>
                <HookTextField {...registerState('firstName')} textFieldProps={{autoComplete: "given-name", autoFocus: true, margin: "normal", fullWidth: true, label: "First Name"}}/>
              </Grid>
              <Grid item xs={12}>
                <HookTextField {...registerState('phoneNumber')} textFieldProps={{autoComplete: "phoneNumber", autoFocus: true, margin: "normal", fullWidth: true, label: "Phone Number"}}/>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Sign up
            </Button>
      </form>
  );
};

  export default RegistrationForm;