import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useHookForm, HookTextField } from 'mui-react-hook-form-plus';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveLatLon, saveVenueId, saveVenue, saveNeighborhood, saveWebsite } from '../../redux/venueSlice';
import { getVenueDetails } from '../../backend';


function RegisterVenueForm(){
    const defaultValues = { venue: ''};
    const { registerState, handleSubmit } = useHookForm({ defaultValues, });
    const {firebaseUID, resyToken} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        console.log(data);
        let res = await getVenueDetails({venueId: parseInt(data.venue), resyToken: resyToken}).then((res) => {
            if (res.status === 200) {
                return res.data;
            } else {
                console.log("Error getting venue details");
                console.log(res.message);
                // defaulting to saving the venue id that the user input
                dispatch(saveVenueId(data.venue));
                dispatch(saveVenue(data.venue));
                navigate(`/user/${firebaseUID}/resy-res-request/`);
            }
        });
        dispatch(saveVenueId(res.id));
        dispatch(saveVenue(res.name));
        dispatch(saveWebsite(res.website));
        dispatch(saveNeighborhood(res.neighborhood));
        dispatch(saveLatLon({lat: res.lat, lon: res.lon}));
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