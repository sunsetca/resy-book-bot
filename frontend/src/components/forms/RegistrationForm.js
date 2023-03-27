import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { registerEmailPassword } from '../../firebase';
import { HookTextField, useHookForm } from 'mui-react-hook-form-plus';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const RegistrationForm = () => {
  const {user, firebaseUID} = useSelector((state) => state.auth);
  const defaultValues = { email: '', password: '', firstName: '', phoneNumber: ''};
  const { registerState, handleSubmit } = useHookForm({ defaultValues, });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/user/${firebaseUID}`);
    }
  }, [user, firebaseUID]);

  const onSubmit = async (data) => {
    await registerEmailPassword(data.email, data.password, data.firstName, data.phoneNumber);
    navigate(`/user/${firebaseUID}`);
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