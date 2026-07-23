import { axiosInstance as axios } from '../api';
import { BASE_URL } from '../url';

/**
Request:
{
    "user": {
        "first_name": "Bob",
        "last_name": "Dylan",
        "email": "bob@dylan.com",
        "phone_number": "+48666777999",
        "phone_number_country_code": "PL"
    }
}
Response:
{
  "user": {
    "id": 123,
    "x_token_user": "null",
    "first_name": "Bob",
    "last_name": "Dylan",
    "email": "bob....com",
    "phone_number": "+4866...",
    "phone_number_verified": false
  }
}
*/
export async function registerUser(headers, x_token_visitor, payload) {
    const headersFined = { ...headers };

    if (x_token_visitor) {
        headersFined['X-Token-Visitor'] = x_token_visitor;
    }

    const { data } = await axios.post(`${BASE_URL}api/v1/users/registration`, payload, {
        headers: headersFined,
    });

    if (!data) throw new Error('An error occured');

    return data;
}

/**
Request:
{
"user": {
    "phone_number": "+48666777888",
    "phone_number_verification_code": "123456"
}
Response:
{
  "user": {
    "id": 123,
    "x_token_user": "12345",
    "first_name": "Bob",
    "last_name": "Dylan",
    "email": "bob@dylan.com",
    "phone_number": "+48666777999",
    "phone_number_verified": true
  }
}
*/
export async function signinUser(headers, x_token_visitor, payload) {
    const headersFined = { ...headers };

    if (x_token_visitor) {
        headersFined['X-Token-Visitor'] = x_token_visitor;
    }

    const { data } = await axios.post(
        `${BASE_URL}api/v1/users/sessions`,
        {
            user: payload,
        },
        {
            headers: headersFined,
        }
    );

    if (!data) throw new Error('An error occured');

    return data;
}

/**
Request:
headers + X-Token-User
Response:
204, no payload
*/
export async function signoutUser(headers, x_token_user) {
    const res = await axios.delete(`${BASE_URL}api/v1/users/sessions`, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    if (res.status !== 204) throw new Error('An error occured');

    return res;
}

/**
Request:
headers + X-Token-User
Response:
204, no payload
*/
export async function deleteUser(headers, x_token_user) {
    const res = await axios.delete(`${BASE_URL}api/v1/users/registration`, {
        headers: {
            ...headers,
            'X-Token-User': x_token_user,
        },
    });

    if (res.status !== 204) throw new Error('An error occured');

    return res;
}

/**
Request:
{
    user: {
        phone_number
    }
}
Response:
204, no payload
*/
export async function recieveConfirmationCode(headers, x_token_visitor, payload) {
    const headersFined = { ...headers };

    if (x_token_visitor) {
        headersFined['X-Token-Visitor'] = x_token_visitor;
    }

    const res = await axios.post(`${BASE_URL}api/v1/users/sessions/sms_confirmation`, payload, {
        headers: headersFined,
    });

    // Testing code: 123456
    if (res.status !== 204) throw new Error('An error occured');

    return res;
}

export async function detailUser(headers, x_token_user) {
    const headersFined = { ...headers };

    headersFined['X-Token-User'] = x_token_user;

    const { data } = await axios.get(`${BASE_URL}api/v1/users/profile`, {
        headers: headersFined,
    });

    if (!data) throw new Error('An error occured');

    return data;
}

export async function updateUserInfo(headers, x_token_user, payload) {
    const headersFined = { ...headers };

    headersFined['X-Token-User'] = x_token_user;

    const { data } = await axios.patch(
        `${BASE_URL}api/v1/users/profile`,
        {
            user: payload,
        },
        {
            headers: headersFined,
        }
    );

    if (!data) throw new Error('An error occured');

    return data;
}

export async function addCoupon(headers, x_token_user, code) {
    const headersFined = { ...headers };

    headersFined['X-Token-User'] = x_token_user;

    const { data } = await axios.post(
        `${BASE_URL}api/v1/users/coupons`,
        {
            coupon: {
                code,
            },
        },
        {
            headers: headersFined,
        }
    );

    if (!data) throw new Error('An error occured');

    return data;
}

export async function fetchReferralsData(headers, x_token_user) {
    const headersFined = { ...headers };

    headersFined['X-Token-User'] = x_token_user;

    const { data } = await axios.get(`${BASE_URL}/api/v1/users/referrals`, {
        headers: headersFined,
    });

    if (!data) throw new Error('An error occured');

    return data;
}

export async function sendReminder(headers, x_token_user, userId) {
    const headersFined = { ...headers };

    headersFined['X-Token-User'] = x_token_user;

    const res = await axios.post(
        `${BASE_URL}/api/v1/users/referrals/${userId}/resend`,
        {},
        {
            headers: headersFined,
        }
    );

    if (res.status !== 204) throw new Error('An error occured');

    return res;
}
