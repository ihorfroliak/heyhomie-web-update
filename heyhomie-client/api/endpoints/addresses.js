/* eslint-disable no-unused-expressions */
import { axiosInstance as axios } from '../api';
import { BASE_URL } from '../url';

// NB! X-Token-User or X-Token-Visitor for all the requests

export async function listAllAddresses(headers, x_token_user, x_token_visitor) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const { data } = await axios.get(`${BASE_URL}api/v1/users/addresses`, {
        headers: headersFined,
    });

    return data;
}

export async function createAddress(headers, x_token_user, x_token_visitor, payload) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const { data } = await axios.post(`${BASE_URL}api/v1/users/addresses`, payload, {
        headers: headersFined,
    });

    return data;
}

export async function getAddressDetails(headers, x_token_user, x_token_visitor, addressID) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const { data } = await axios.get(`${BASE_URL}api/v1/users/addresses/${addressID}`, {
        headers: headersFined,
    });

    return data;
}

export async function editAddressDetails(headers, x_token_user, x_token_visitor, addressID, payload) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const { data } = await axios.patch(`${BASE_URL}api/v1/users/addresses/${addressID}`, payload, {
        headers: headersFined,
    });

    return data;
}

export async function deleteAddress(headers, x_token_user, x_token_visitor, addressID) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const res = await axios.delete(`${BASE_URL}api/v1/users/addresses/${addressID}`, {
        headers: headersFined,
    });

    if (res.status !== 204) throw new Error('An error occured');

    return res;
}
