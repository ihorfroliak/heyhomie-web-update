import { axiosInstance as axios } from '../api';
import { BASE_URL } from '../url';

// NB! X-Token-User for all the requests

export async function listAllCards(headers, x_token_user) {
    const { data } = await axios.get(`${BASE_URL}api/v1/users/cards`, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    return data;
}

export async function createCard(headers, x_token_user, payload) {
    const { data } = await axios.post(`${BASE_URL}api/v1/users/cards`, payload, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    return data;
}

export async function getCardDetails(headers, x_token_user, cardID) {
    const { data } = await axios.get(`${BASE_URL}api/v1/users/cards/${cardID}`, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    return data;
}

export async function setDefaultCard(headers, x_token_user, cardID) {
    const { data } = await axios.put(
        `${BASE_URL}api/v1/users/cards/${cardID}/set_default`,
        {},
        {
            headers: {
                ...headers,
                'X-Token-User': x_token_user,
            },
        }
    );

    return data;
}

export async function deleteCard(headers, x_token_user, cardID) {
    const res = await axios.delete(`${BASE_URL}api/v1/users/cards/${cardID}`, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    if (res.status !== 204) throw new Error('An error occured');

    return res;
}

export async function fetchPayments(headers, x_token_user) {
    const { data } = await axios.get(`${BASE_URL}api/v1/users/payments`, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    return data;
}
