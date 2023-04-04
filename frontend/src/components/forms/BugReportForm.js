import { HookTextField, HookSelect, useHookForm } from "mui-react-hook-form-plus";
import { Button, Grid } from "@mui/material";
import { createBugReport } from "../../backend";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function BugReportForm() {
  const navigate = useNavigate();
  const defaultValues = {
    email: '',
    title: '',
    body: "",
    level: "",
    bugLevels: [
      { value: 1, label: 'Breaking change' },
      { value: 2, label: 'Slight issue but not too bad' },
      { value: 3, label: 'Please add this feature' },
    ],
  };
  
  const { registerState, handleSubmit } = useHookForm({ defaultValues });
  const { firebaseUID } = useAuth();

  const onSubmit = async (data) => {
    await createBugReport(data).catch((error) => {
      console.log(error);
    });
    navigate(`/user/${firebaseUID}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HookTextField
            {...registerState("email")}
            textFieldProps={{
              autoComplete: "email",
              autoFocus: true,
              margin: "normal",
              fullWidth: true,
              label: "Email",
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <HookTextField
            {...registerState("title")}
            textFieldProps={{
              autoComplete: "title",
              autoFocus: true,
              margin: "normal",
              fullWidth: true,
              label: "Bug Subject",
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <HookSelect {...registerState('level')} label="Bug Level" rules={{required: { value: true, message: 'Please select a bug level'}}} selectProps={{clearable: true, sx: {marginTop:"0"}}} items={defaultValues.bugLevels}/>
        </Grid>
        <Grid item xs={12}>
          <HookTextField
            {...registerState("body")}
            textFieldProps={{
              autoComplete: "bugDescription",
              margin: "normal",
              fullWidth: true,
              label: "Bug Description",
              multiline: true,
              rows: 4,
              maxLength: 500
            }}
          />
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Submit Bug Report</Button>
    </form>
  );
}

export default BugReportForm;
