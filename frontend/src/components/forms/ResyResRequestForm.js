import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { HookTextField, useHookForm } from 'mui-react-hook-form-plus';
import { useSelector } from 'react-redux';

function ResyResRequestForm(){
  const defaultValues = { email: ''};
  const { registerState, handleSubmit } = useHookForm({ defaultValues, });
  const {long, lat} = useSelector((state) => state.venue);

  const onSubmit = (data) => {
    let email = data.email;
    console.log({
      email: email,
    });
  }
  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HookTextField {...registerState('email')} textFieldProps={{autoComplete: "email", autoFocus: true, margin: "normal", fullWidth: true, label: "Email"}}/>
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
  )
}

export default ResyResRequestForm;