/* eslint-disable no-unused-expressions */
import { axiosInstance as axios } from '../api';
import { BASE_URL } from '../url';

export async function createOrderSession(headers, x_token_user, x_token_visitor, payload) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const { data } = await axios.post(`${BASE_URL}api/v1/orders/sessions`, payload, {
        headers: headersFined,
    });

    return data;
}

export async function createServiceForOrder(headers, x_token_user, x_token_visitor, orderID, payload) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const { data } = await axios.post(`${BASE_URL}api/v1/orders/${orderID}/services`, payload, {
        headers: headersFined,
    });

    return data;
}

export async function getServiceDetailsForOrder(headers, x_token_user, x_token_visitor, orderID, serviceID) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const { data } = await axios.get(`${BASE_URL}api/v1/orders/${orderID}/services/${serviceID}`, {
        headers: headersFined,
    });

    return data;
}

export async function editServiceForOrder(headers, x_token_user, x_token_visitor, orderID, payload) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const { data } = await axios.patch(`${BASE_URL}api/v1/orders/${orderID}/services/${payload.service.id}`, payload, {
        headers: headersFined,
    });

    return data;
}

export async function getAllServicesForOrder(headers, x_token_user, x_token_visitor, orderID) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const { data } = await axios.get(`${BASE_URL}api/v1/orders/${orderID}/services`, {
        headers: headersFined,
    });

    return data;
}

export async function deleteServiceFromOrder(headers, x_token_user, x_token_visitor, orderID, serviceID) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const res = await axios.delete(`${BASE_URL}api/v1/orders/${orderID}/services/${serviceID}`, {
        headers: headersFined,
    });

    if (res.status !== 204) throw new Error('An error occured');

    return res;
}

export async function calculatePriceForOrder(headers, x_token_user, x_token_visitor, orderID) {
    const headersFined = { ...headers };

    x_token_user ? (headersFined['X-Token-User'] = x_token_user) : (headersFined['X-Token-Visitor'] = x_token_visitor);

    const { data } = await axios.get(`${BASE_URL}api/v1/orders/${orderID}/prices`, {
        headers: headersFined,
    });
    if (!data) throw new Error('An error occured');

    return data;
}

export async function confirmOrder(headers, x_token_user, orderID, defaultCard = { payment_method: 'card' }) {
    if (!x_token_user) throw new Error('User must be signed in');

    const headersFined = { ...headers };

    headersFined['X-Token-User'] = x_token_user;

    const res = await axios.post(
        `${BASE_URL}api/v1/orders/${orderID}/confirm`,
        {
            payment_method: defaultCard.payment_method,
        },
        {
            headers: headersFined,
        }
    );

    if (res.status !== 204) throw new Error('An error occured');

    return res;
}
