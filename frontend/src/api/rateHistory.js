import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rate-history';

export const addRateHistory = async (from, to, rate, token) => {
  return axios.post(API_URL, { from, to, rate }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getRateHistory = async (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
