import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { HookTextField, useHookForm } from 'mui-react-hook-form-plus';
import { useDispatch, useSelector } from 'react-redux';
import { authorizeResyToken } from '../../backend';
import { useNavigate } from "react-router-dom";
import { saveResyToken } from '../../redux/authSlice';

function ResyTokenForm(){
  const defaultValues = { email: ''};
  const { registerState, handleSubmit } = useHookForm({ defaultValues, });
  const {firebaseUID} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    await authorizeResyToken(data);
    dispatch(saveResyToken(data.resy_token));
    navigate(`/user/${firebaseUID}`);
  }

  return( 
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HookTextField {...registerState('email')} textFieldProps={{autoComplete: "email", autoFocus: true, margin: "normal", fullWidth: true, label: "Email"}}/>
        </Grid>
        <Grid item xs={12}>
          <HookTextField {...registerState('resy_token')} textFieldProps={{autoFocus: true, margin: "normal", fullWidth: true, label: "Resy Auth Token"}}/>
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </form>
  );
}

  export default ResyTokenForm;