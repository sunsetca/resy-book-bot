import axios from 'axios';

async function getUserProfile(params) {
    let request_url = `/user/user-profile?` + (new URLSearchParams(params).toString());
    let userProfile = await axios.get(request_url);
    return userProfile.data;
};

async function authorizeResyToken(formData) {
    let response = await axios.post('/user/authorize-resy', formData);
    return response;
}

async function deleteResyToken(params) {
    let request_url = `/user/delete-resy-token` + (new URLSearchParams(params).toString());
    let response = await axios.post(request_url);
    return response;
}

async function requestReservationTask(formData) {
    let response = await axios.post('/resy/create', formData);
    return response;
}

export {
    authorizeResyToken,
    getUserProfile,
    requestReservationTask
}