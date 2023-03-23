import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    loading: false,
    venue: null,
    lng: null,
    lat: null,
    error: null
};


const venueSlice = createSlice({
    name: 'venue',
    initialState,
    reducers: {
        saveLatLong(state, action){
            state.lng = action.payload.lng;
            state.lat = action.payload.lat;
        },
        saveVenueId(state, action){
            state.id = action.payload
        }
    }
});

export const { saveLatLong, saveVenueId } = venueSlice.actions;
export default venueSlice.reducer;