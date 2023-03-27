import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { saveLatLong, saveVenue, saveVenueId, saveNeighborhood } from '../../redux/venueSlice';
import VenueSelectionDialog from '../VenueSelectionDialog';
import { searchVenue } from '../../backend';
import { getResyToken } from '../../firebase';

const VenueRequestForm = (props) => {
    const [isOpen, setOpen] = useState(false);
    const [clear, setClear] = useState(false);
    const [isSearch, setSearch] = useState(false);
    const [searchOptions, setSearchOptions] = useState([]);
    const {lon, lat, venue, neighborhood} = useSelector((state) => state.venue);
    const { user, firebaseUID } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const updateSelection = async (selection) => {
        console.log(selection);
        console.log(`prev long lat ${lon}:${lat}`)
        await geocodeByPlaceId(selection.value.place_id).then(results => {
            let lat = results[0].geometry.location.lat();
            let lon = results[0].geometry.location.lng();
            dispatch(saveLatLong({lon: lon, lat: lat}));
        })

    }
    
    const onClick = async () => {
        let resyToken = await getResyToken(firebaseUID);
        let resp = await searchVenue({lon: lon, lat: lat, email: user.email, resyToken: resyToken._token});
        let { search, primary } = resp.data;
        console.log(resp.data);
        dispatch(saveVenue(primary.name))
        dispatch(saveVenueId(primary.id))
        dispatch(saveNeighborhood(primary.neighborhood));
        setSearchOptions(search);
        setClear(true);
        setOpen(true);
    }

    return (
        <>
            <Grid container spacing={1}>
                <Grid item >
                    <Typography>Search for a venue <Tooltip title="Please search for a valid Resy establishment. Cross reference through https://www.resy.com"><IconButton><AnnouncementIcon/></IconButton></Tooltip></Typography> 
                </Grid>
                <Grid item xs={12}>
                    <GooglePlacesAutocomplete
                                apiKey={process.env.REACT_APP_MAPS_API_KEY}
                                selectProps={{
                                    placeholder: "The Ten Bells...",
                                    onChange: updateSelection,
                                    clearValue: clear
                                }}
                            />
                </Grid>
            </Grid>
            <Button
            onClick={onClick}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
                Select Restaurant
            </Button>
            {/** This is a terrible anti pattern where I'm passing down multiple state handlers so that they can be operated at their youngest descendent */}
            <VenueSelectionDialog isOpen={isOpen} setOpen={setOpen} setMapSearchClear={setClear} isSearch={isSearch} setSearch={setSearch} parentModalClose={props.parentModalClose} venueName={venue} venueNeighborhood={neighborhood} searchOptions={searchOptions}/>
        </>
    )
}

export default VenueRequestForm;