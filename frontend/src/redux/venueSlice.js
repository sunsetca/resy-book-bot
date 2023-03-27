import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    loading: false,
    venue: null,
    neighborhood: null,
    website: null,
    lon: null,
    lat: null,
    error: null
};


const venueSlice = createSlice({
    name: 'venue',
    initialState,
    reducers: {
        saveLatLon(state, action){
            state.lon = action.payload.lon;
            state.lat = action.payload.lat;
        },
        saveVenue(state, action){
            state.venue = action.payload
        },
        saveVenueId(state, action){
            state.id = action.payload
        },
        saveNeighborhood(state, action){
            state.neighborhood = action.payload
        },
        saveWebsite(state, action){
            state.website = action.payload
        }
    }
});

export const { saveLatLon, saveVenueId, saveVenue, saveNeighborhood, saveWebsite } = venueSlice.actions;
export default venueSlice.reducer;