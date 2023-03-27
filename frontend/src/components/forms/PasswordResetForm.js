import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { HookTextField, useHookForm } from 'mui-react-hook-form-plus';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../firebase';

function ResetPassword() {
    const defaultValues = { email: ''};
    const { registerState, handleSubmit } = useHookForm({ defaultValues, });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        await resetPassword(data.email);
        navigate(`/`);
    }

    return (
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
              submit
            </Button>
        </form>
    )
}

export default ResetPassword;