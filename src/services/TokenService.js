export const getRefreshToken = () => localStorage.getItem('WC_' + encode('refreshToken'));

export const setRefreshToken = (token) => localStorage.setItem('WC_' + encode('refreshToken'), token);

export const removeRefreshToken = () => {
  localStorage.removeItem('WC_' + encode('refreshToken'));
};

export const getAccessToken = () => localStorage.getItem('WC_' + encode('accessToken'));

export const setAccessToken = (token) => {
  localStorage.setItem('WC_' + encode('accessToken'), token);
  window.dispatchEvent(new Event('userChange'));
};

export const removeAccessToken = () => localStorage.removeItem('WC_' + encode('accessToken'));

const encode = (token) => token.split('').map(c => c.charCodeAt(0)).map(n => (n + 10).toString(16)).join('');