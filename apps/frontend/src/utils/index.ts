export const getToken = () => {
  return localStorage.getItem('token') || '';
};
