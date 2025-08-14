import axios from 'axios';

const API_URL = 'http://localhost:5000/api/statuses';

export const addStatus = async (name, description, token) => {
  return axios.post(API_URL, { name, description }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getStatuses = async (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
