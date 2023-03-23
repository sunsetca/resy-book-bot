import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: null,
    firebaseUID: null,
    rememberMe: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        saveUser(state, action) {
            state.user = action.payload;
        },
        saveFirebaseUID(state, action) {
            state.firebaseUID = action.payload;
        },
        saveRememberChoice(state, action){
            state.rememberMe = action.payload;
        }
    }
});

export const { saveUser, saveFirebaseUID, saveRememberChoice } = authSlice.actions;
export default authSlice.reducer;