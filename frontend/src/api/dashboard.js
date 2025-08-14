import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

export const getDashboardStats = async (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
