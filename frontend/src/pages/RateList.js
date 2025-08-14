import React, { useEffect, useState } from 'react';
import { getRates } from '../api/rate';
import { getAuth } from '../utils/auth';

function RateList() {
    const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem('auth');
      navigate('/login');
    };
  const [rates, setRates] = useState([]);
  const [error, setError] = useState('');
  const { token, role } = getAuth();
  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await getRates(token);
        setRates(res.data);
      } catch (err) {
        setError('Erreur lors de la récupération des taux');
      }
    }
    fetchRates();
  }, [token]);
  if (error) return <p style={{ color: '#e74c3c', textAlign: 'center', fontWeight: 600 }}>{error}</p>;
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 32, background: '#f8f9fa', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button onClick={handleLogout} style={{ padding: '8px 18px', background: 'linear-gradient(90deg, #e74c3c 0%, #f1c40f 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,76,60,0.10)' }}>Déconnexion</button>
        </div>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: 32, fontWeight: 700, fontSize: 28 }}>Liste des taux</h2>
      <div style={{ overflowX: 'auto', borderRadius: 12, boxShadow: '0 2px 8px rgba(44,62,80,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
          <thead style={{ background: '#ecf0f1' }}>
            <tr>
              <th style={{ padding: 12, fontWeight: 700, color: '#34495e', borderBottom: '2px solid #bdc3c7' }}>De</th>
              <th style={{ padding: 12, fontWeight: 700, color: '#34495e', borderBottom: '2px solid #bdc3c7' }}>À</th>
              <th style={{ padding: 12, fontWeight: 700, color: '#34495e', borderBottom: '2px solid #bdc3c7' }}>Taux</th>
              <th style={{ padding: 12, fontWeight: 700, color: '#34495e', borderBottom: '2px solid #bdc3c7' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {rates.map(rate => (
              <tr key={rate._id} style={{ borderBottom: '1px solid #ecf0f1', transition: 'background 0.2s', background: '#fff' }}>
                <td style={{ padding: 10 }}>{rate.currencyFrom}</td>
                <td style={{ padding: 10 }}>{rate.currencyTo}</td>
                <td style={{ padding: 10 }}>{rate.rate}</td>
                <td style={{ padding: 10 }}>{new Date(rate.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RateList;
