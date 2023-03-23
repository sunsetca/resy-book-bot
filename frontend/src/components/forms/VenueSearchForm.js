import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { HookTextField, useHookForm } from 'mui-react-hook-form-plus';
import GooglePlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId } from 'react-google-places-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { saveLatLong } from '../../redux/venueSlice';
import VenueSelectionDialog from '../VenueSelectionDialog';
import { searchVenue } from '../../backend';
import { getResyToken } from '../../firebase';

const VenueRequestForm = () => {
    const [isOpen, setOpen] = useState(false);
    const defaultValues = {};
    const { registerState, handleSubmit } = useHookForm({ defaultValues, });
    const {lng, lat} = useSelector((state) => state.venue);
    const { user, firebaseUID } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const updateSelection = async (selection) => {
        console.log(selection);
        console.log(`prev long lat ${lng}:${lat}`)
        await geocodeByPlaceId(selection.value.place_id).then(results => {
            let lat = results[0].geometry.location.lat();
            let lng = results[0].geometry.location.lng();
            dispatch(saveLatLong({lng: lng, lat: lat}));
        })

    }
    
    const onSubmit = (data) => {
        console.log(`curr long lat ${lng}:${lat}`);
        let resyToken = getResyToken(firebaseUID)._token;
        let resp = searchVenue({lng: lng, lat: lat, email: user.email, resyToken: resyToken});
        console.log(resp);
        setOpen(true);
    }

    return (
        <>
            <Grid container spacing={1}>
                <Grid item >
                    <Typography>Search for a venue <Tooltip title="Please search for a valid Resy establishment. Cross reference through resy.com"><IconButton><AnnouncementIcon/></IconButton></Tooltip></Typography> 
                </Grid>
                <Grid item xs={12}>
                    <GooglePlacesAutocomplete
                                apiKey={process.env.REACT_APP_MAPS_API_KEY}
                                selectProps={{
                                    placeholder: "Cafe Rosarito...",
                                    onChange: updateSelection
                                }}
                            />
                </Grid>
            </Grid>
            <Button
            onClick={onSubmit}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
                Select Restaurant
            </Button>
            <VenueSelectionDialog isOpen={isOpen} setOpen={setOpen} venueName={"venue something"} venueLink={"some https"}/>
        </>
    )
}

export default VenueRequestForm;