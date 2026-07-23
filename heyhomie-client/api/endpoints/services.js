/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
import { axiosInstance as axios } from '../api';
import { BASE_URL } from '../url';

export async function calculateServicePrice(headers, x_token_user, x_token_visitor, serviceID, payload) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    try {
        const { data } = await axios.post(`${BASE_URL}api/v1/services/${serviceID}/calculate`, payload, {
            headers: headersFined,
        });

        return { ...data.service_price };
    } catch (err) {
        console.error(err);
    }
}

export async function listServices(headers, x_token_user) {
    const { data } = await axios.get(`${BASE_URL}api/v1/users/services`, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    return data;
}

export async function editService(headers, x_token_user, serviceID, payload) {
    const { data } = await axios.patch(`${BASE_URL}api/v1/users/services/${serviceID}`, payload, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    return data;
}

export async function cancelService(headers, x_token_user, serviceID) {
    const res = await axios.delete(`${BASE_URL}api/v1/users/services/${serviceID}`, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    if (res.status !== 204) throw new Error('An error occured');

    return res;
}
