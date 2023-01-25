import ax from 'axios';
import { toast } from 'react-toastify';
import { getAccessToken, getRefreshToken, setAccessToken } from './TokenService';

const axios = ax.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axios.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
},
(error) => Promise.reject(error));

axios.interceptors.response.use((res) => {
  return res;
},
async(err) => {
  const config = err.config;
  if (err.response) {
    if (err.response.status === 401 && !config._retry) {
      config._retry = true;

      try {
        const res = await axios.post('users/refresh-token', {
          refreshToken: getRefreshToken()
        });

        const { accessToken } = res.data.data;
        setAccessToken(accessToken);

        return axios(config);
      } catch (_err) {
        toast.error('Login expired. Please login as usual.');
        return Promise.reject(_err);
      }
    }
  }
  return Promise.reject(err);
});

export default axios;