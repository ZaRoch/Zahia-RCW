import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';


export const createTransaction = async (data, token) => {
  return axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getTransactions = async (token, url = API_URL) => {
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
