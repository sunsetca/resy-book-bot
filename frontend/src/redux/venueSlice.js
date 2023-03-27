import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    loading: false,
    venue: null,
    neighborhood: null,
    lon: null,
    lat: null,
    error: null
};


const venueSlice = createSlice({
    name: 'venue',
    initialState,
    reducers: {
        saveLatLong(state, action){
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
        }
    }
});

export const { saveLatLong, saveVenueId, saveVenue, saveNeighborhood } = venueSlice.actions;
export default venueSlice.reducer;