import { axiosInstance as axios } from '../api';
import { BASE_URL } from '../url';

// NB! X-Token-User for all the requests

export async function listMissions(headers, x_token_user, date) {
    const { data } = await axios.get(`${BASE_URL}api/v1/users/missions?date=${date}`, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    return data;
}

export async function editMission(headers, x_token_user, missionID, payload) {
    const { data } = await axios.patch(`${BASE_URL}api/v1/users/missions/${missionID}`, payload, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    return data;
}

export async function cancelMission(headers, x_token_user, missionID) {
    const res = await axios.delete(`${BASE_URL}api/v1/users/missions/${missionID}`, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    if (res.status !== 204) throw new Error('An error occured');

    return res;
}
