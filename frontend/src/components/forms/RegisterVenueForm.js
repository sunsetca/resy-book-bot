import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useHookForm, HookTextField } from 'mui-react-hook-form-plus';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { saveLatLon, saveVenueId, saveVenue, saveNeighborhood, saveWebsite } from '../../redux/venueSlice';
import { getVenueDetails } from '../../backend';


function RegisterVenueForm(){
    const defaultValues = { venue: ''};
    const { registerState, handleSubmit } = useHookForm({ defaultValues, });
    const {user, firebaseUID, resyToken} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
        navigate(`/`);
        }
    }, [user]);

    const onSubmit = async (data) => {
        console.log(data);
        let { id, name, website, neighborhood,  lat, lon } = await getVenueDetails({venueId: parseInt(data.venue), resyToken: resyToken});
        dispatch(saveVenueId(id));
        dispatch(saveVenue(name));
        dispatch(saveWebsite(website));
        dispatch(saveNeighborhood(neighborhood));
        dispatch(saveLatLon({lat, lon}));
        navigate(`/user/${firebaseUID}/resy-res-request/`);
    }

    return( 
        <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <HookTextField {...registerState('venue')} textFieldProps={{autoFocus: true, margin: "normal", fullWidth: true, label: "Venue ID"}}/>
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

export default RegisterVenueForm;