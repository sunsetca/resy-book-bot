import axios from 'axios';

export default async function getUserProfile(params) {
    let request_url = `/user/user_profile?` + (new URLSearchParams(params).toString());
    let userProfile = await axios.get(request_url);
    return userProfile;
};