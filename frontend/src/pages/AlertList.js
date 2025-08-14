import React, { useEffect, useState } from 'react';
import { getAlerts } from '../api/alert';
import { getAuth } from '../utils/auth';

function AlertList() {
    const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem('auth');
      navigate('/login');
    };
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const { token, role } = getAuth();

  useEffect(() => {
    if (!token || (role !== 'agent' && role !== 'superviseur')) {
      setError('Accès refusé.');
      return;
    }
    async function fetchAlerts() {
      try {
        const res = await getAlerts(token);
        setAlerts(res.data);
      } catch (err) {
        setError('Erreur lors de la récupération des alertes');
      }
    }
    fetchAlerts();
  }, [token, role]);
  if (error) return <p style={{ color: '#e74c3c', textAlign: 'center', fontWeight: 600 }}>{error}</p>;
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 32, background: '#f8f9fa', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button onClick={handleLogout} style={{ padding: '8px 18px', background: 'linear-gradient(90deg, #e74c3c 0%, #f1c40f 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,76,60,0.10)' }}>Déconnexion</button>
        </div>
      <h2 style={{ textAlign: 'center', color: '#e74c3c', marginBottom: 32, fontWeight: 700, fontSize: 28 }}>Alertes</h2>
      <div style={{ overflowX: 'auto', borderRadius: 12, boxShadow: '0 2px 8px rgba(231,76,60,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
          <thead style={{ background: '#f9ebea' }}>
            <tr>
              <th style={{ padding: 12, fontWeight: 700, color: '#c0392b', borderBottom: '2px solid #e74c3c' }}>Type</th>
              <th style={{ padding: 12, fontWeight: 700, color: '#c0392b', borderBottom: '2px solid #e74c3c' }}>Message</th>
              <th style={{ padding: 12, fontWeight: 700, color: '#c0392b', borderBottom: '2px solid #e74c3c' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(alert => (
              <tr key={alert._id} style={{ borderBottom: '1px solid #f9ebea', transition: 'background 0.2s', background: '#fff' }}>
                <td style={{ padding: 10 }}>{alert.type}</td>
                <td style={{ padding: 10 }}>{alert.message}</td>
                <td style={{ padding: 10 }}>{new Date(alert.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlertList;
