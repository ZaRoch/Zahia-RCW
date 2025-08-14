import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (fullName, email, password, role) => {
  return axios.post(`${API_URL}/register`, { fullName, email, password, role });
};

export const login = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
