import { 
  Button,
  Grid, 
  Link} from '@mui/material';
import { 
  HookCheckBox, 
  HookTextField, 
  useHookForm } from 'mui-react-hook-form-plus';
import { useDispatch, useSelector } from 'react-redux';
import { saveRememberChoice } from '../../redux/authSlice';

import {
  signInEmailPw, 
  signInWithGoogle, 
   } from '../../firebase';
import GoogleLogo from '../../img/google_logo.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginWithOtherProviders = (props) => {
  const {user, firebaseUID} = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/user/${firebaseUID}`);
    }
  }, [user, firebaseUID]);

  const thirdPartySignIn = async () => {
    await signInWithGoogle();
  }

  return (
      <Button onClick={thirdPartySignIn} fullWidth variant="contained" sx={{mt: 3, mb: 2}} startIcon={<img src={GoogleLogo} alt="Google Logo" width={25} height={25}/>}>
        {props.action} with Google
      </Button>
  )
};

function Login() {
  const {user, firebaseUID} = useSelector((state) => state.auth);
  const defaultValues = { email: '', password: '', remember: false};
  const { registerState, handleSubmit } = useHookForm({ defaultValues, });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/user/${firebaseUID}`);
    }
  }, [user, firebaseUID, navigate]);


  const onSubmit = async (data) => {
    let remember = data.remember;
    await signInEmailPw(data.email, data.password);
    dispatch(saveRememberChoice(remember));
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
          Login
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="/password-reset" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="/register" variant="body2">
              {"Don't have an account? Register"}
            </Link>
          </Grid>
        </Grid>
    </form>
  );
}

export default Login;
export {
  LoginWithOtherProviders
}