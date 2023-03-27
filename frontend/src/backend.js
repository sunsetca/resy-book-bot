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
  let request_url = `/resy/create?` + new URLSearchParams({ uid: formData.uid }).toString();
  let payload = createFormPayload(formData);
  let response = await axios.post(request_url, payload);
  return response;
}
  

async function searchVenue(params) {
  let request_url = `/resy/search?` + (new URLSearchParams({email: params.email}).toString());
  let searchDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  let headers = {
      'RESY-AUTH-TOKEN': params.resyToken,
      'Content-Type': 'application/x-www-form-urlencoded'
  }

  let payload = createFormPayload({
      "lat": params.lat,
      "lon": params.lon,
      "day": searchDate,
      "party_size": params.partySize
  });

  let response = await axios.post(request_url, payload, { headers: headers });
  return response;
}

async function getVenueDetails(params) {
    let request_url = `/resy/venue-details?` + (new URLSearchParams({venue_id: params.venueId}).toString());
    let headers = {
        'RESY-AUTH-TOKEN': params.resyToken
    }
    let response = await axios.get(request_url, { headers: headers }).then((response) => { return response }).catch((err) => { return err });
    return response;
}

function createFormPayload(formData) {
    let payload = new FormData();

    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          if (Array.isArray(formData[key])) {
            formData[key].forEach((item, index) => {
              payload.append(`${key}-${index}`, item);
            });
          } else {
            payload.append(key, formData[key]);
          }
        }
      }
    return payload;
}

export {
    authorizeResyToken,
    getUserProfile,
    requestReservationTask,
    searchVenue,
    getVenueDetails
}