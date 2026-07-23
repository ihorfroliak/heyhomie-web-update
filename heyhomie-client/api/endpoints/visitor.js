import { axiosInstance as axios } from '../api';
import { BASE_URL } from '../url';

/** Response model:
{
    "visitor": {
      "x_token_visitor": "12345",
      "expires_at": 1580663374
    }
}
*/
export async function registerVisitor(headers) {
    const { data } = await axios.post(
        `${BASE_URL}api/v1/visitors/registration`,
        {},
        {
            headers,
        }
    );

    if (!data) throw new Error('An error occured');

    return data;
}
