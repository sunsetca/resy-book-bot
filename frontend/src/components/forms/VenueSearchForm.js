import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { saveLatLon, saveVenue, saveVenueId, saveNeighborhood, saveWebsite } from '../../redux/venueSlice';
import VenueSelectionDialog from '../VenueSelectionDialog';
import { searchVenue } from '../../backend';
import { getResyToken } from '../../firebase';


import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


function VenueSearchModal({ open, handleClose, partySize }) {
    return (
        <Modal open={open} onClose={handleClose}>
        <Box
            sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            }}
        >
            <VenueRequestForm parentModalClose={handleClose} partySize={partySize} />
        </Box>
        </Modal>
    );
}

const VenueRequestForm = (props) => {
    const [isOpen, setOpen] = useState(false);
    const [clear, setClear] = useState(false);
    const [isSearch, setSearch] = useState(false);
    const [searchOptions, setSearchOptions] = useState([]);
    const {lon, lat, venue, neighborhood, website} = useSelector((state) => state.venue);
    const { firebaseUID, resyToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();


    const updateSelection = async (selection) => {
        await geocodeByPlaceId(selection.value.place_id).then(results => {
            let lat = results[0].geometry.location.lat();
            let lon = results[0].geometry.location.lng();
            dispatch(saveLatLon({lon: lon, lat: lat}));
        })

    }
    
    const onClick = async () => {
        let activeResyToken = resyToken || await getResyToken(firebaseUID);
        let resp = await searchVenue({lon: lon, lat: lat, uid: firebaseUID, resyToken: (activeResyToken || activeResyToken._token), partySize: props.partySize});
        let { search, primary } = resp.data;
        dispatch(saveVenue(primary.name))
        dispatch(saveVenueId(primary.id))
        dispatch(saveNeighborhood(primary.neighborhood));
        dispatch(saveLatLon({lon: primary.lon, lat: primary.lat}));
        dispatch(saveWebsite(primary.website));
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
            <VenueSelectionDialog isOpen={isOpen} setOpen={setOpen} setMapSearchClear={setClear} isSearch={isSearch} setSearch={setSearch} parentModalClose={props.parentModalClose} venueName={venue} venueNeighborhood={neighborhood} venueSite={website} searchOptions={searchOptions}/>
        </>
    )
}

export default VenueSearchModal;