import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { HookCheckBox, HookTextField, useHookForm } from 'mui-react-hook-form-plus';

import { signInEmailPw } from '../../firebase'

function SignInForm() {
  const defaultValues = { email: '', password: '', remember: false};
  const { registerState, handleSubmit } = useHookForm({ defaultValues, });

  const onSubmit = (data) => {
    let email = data.email;
    let password = data.password;
    let remember = data.remember;
    console.log({
      email: email,
      password: password,
      remember: remember
    });
    // send response to firebase and process tokens and save in session storage
    signInEmailPw(email, password).then(async (user) => {
      let userFirebaseSession = await user.getIdToken();
      localStorage.setItem('firebaseSession', userFirebaseSession)
    });
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
          </Grid>
          <HookCheckBox {...registerState('remember')} formControlLabelProps={{label: "Remember me"}}/>
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
      </form>
  );
}

export default SignInForm;