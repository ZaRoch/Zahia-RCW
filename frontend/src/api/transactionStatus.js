import axios from 'axios';

export const updateTransactionStatus = async (id, status, token) => {
  return axios.patch(`http://localhost:5000/api/transactions/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
