import { axiosInstance as axios } from '../api';
import { BASE_URL } from '../url';

export async function verifyTokenVisitor(headers, x_token_visitor) {
    try {
        const headersFined = { ...headers };
        headersFined['X-Token-Visitor'] = x_token_visitor;

        const res = await axios.post(
            `${BASE_URL}api/v1/sessions/verify`,
            {},
            {
                headers: headersFined,
            }
        );

        if (!res || res.status !== 204) throw new Error('Visitor token not valid');

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export async function verifyTokenUser(headers, x_token_user) {
    try {
        const headersFined = { ...headers };
        headersFined['X-Token-User'] = x_token_user;

        const res = await axios.post(
            `${BASE_URL}api/v1/sessions/verify`,
            {},
            {
                headers: headersFined,
            }
        );

        if (!res || res.status !== 204) throw new Error('User token not valid');

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}
