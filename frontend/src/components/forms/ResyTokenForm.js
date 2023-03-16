import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { HookTextField, useHookForm } from 'mui-react-hook-form-plus';

function ResyTokenForm(){
  const defaultValues = { email: ''};
  const { registerState, handleSubmit } = useHookForm({ defaultValues, });

  const onSubmit = (data) => {
    let email = data.email;
    let token = data.resy_token;
    console.log({
      email: email,
      token: token
    });
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