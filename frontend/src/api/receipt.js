import axios from 'axios';

const API_URL = 'http://localhost:5000/api/receipts';

export const getReceiptPDF = async (id, token) => {
  return axios.get(`${API_URL}/${id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob'
  });
};

export const getReceiptJSON = async (id, token) => {
  return axios.get(`${API_URL}/${id}/json`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
