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

async function searchVenue(params) {
    console.log(params);
    let request_url = `/resy/search` + (new URLSearchParams({email: params.email}).toString());
    let searchDate = new Date(Date.now());
    searchDate.setDate(searchDate.getDate() + 1);
    
    let payload = {
        "lat": params.lat,
        "long": params.lng,
        "day": searchDate.toDateString(),
        "party_size": 2
    };
    // let response = await axios.post(request_url, payload);
    // return response;
}

async function getUserResyToken(firebaseUID) {

}

export {
    authorizeResyToken,
    getUserProfile,
    requestReservationTask,
    searchVenue
}