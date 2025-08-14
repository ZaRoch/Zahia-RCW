import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOrUpdateRate } from '../api/rate';
import { getAuth } from '../utils/auth';

function RateForm() {
    const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem('auth');
      navigate('/login');
    };
  const [currencyFrom, setCurrencyFrom] = useState('');
  const [currencyTo, setCurrencyTo] = useState('');
  const [rate, setRate] = useState('');
  const [error, setError] = useState('');
  const { token, role } = getAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== 'superviseur') {
      setError('Seul le superviseur peut gérer les taux.');
      return;
    }
    try {
      await addOrUpdateRate(currencyFrom, currencyTo, rate, token);
      setError('Taux enregistré.');
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du taux');
    }
  };
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', padding: '40px 0' }}>
  <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(44,62,80,0.12)', padding: 32, fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: 22, letterSpacing: 0.5 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 8 }}>
          <button onClick={handleLogout} style={{ padding: '8px 18px', background: 'linear-gradient(90deg, #e74c3c 0%, #f1c40f 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,76,60,0.10)' }}>Déconnexion</button>
          <button onClick={() => navigate('/transactions')} style={{ padding: '8px 18px', background: 'linear-gradient(90deg, #3498db 0%, #6dd5fa 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(52,152,219,0.10)' }}>Retour à l'historique</button>
        </div>
  <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: 32, fontWeight: 900, fontSize: 38, letterSpacing: 1, fontFamily: 'Segoe UI, Arial, sans-serif' }}>Gérer les taux de conversion</h2>
  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22, background: 'linear-gradient(90deg, #f8f9fa 0%, #e0eafc 100%)', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(44,62,80,0.06)', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 0.5 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <select value={currencyFrom} onChange={e => setCurrencyFrom(e.target.value)} style={{ flex: 1, padding: 16, borderRadius: 8, border: '1px solid #b2bec3', fontSize: 22, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
              <option value="">De</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="MAD">MAD</option>
              <option value="CAD">CAD</option>
            </select>
            <select value={currencyTo} onChange={e => setCurrencyTo(e.target.value)} style={{ flex: 1, padding: 16, borderRadius: 8, border: '1px solid #b2bec3', fontSize: 22, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
              <option value="">À</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="MAD">MAD</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
          <input type="number" placeholder="Taux" value={rate} onChange={e => setRate(e.target.value)} style={{ padding: 16, borderRadius: 8, border: '1px solid #b2bec3', fontSize: 22, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)', fontFamily: 'Segoe UI, Arial, sans-serif' }} />
          <button type="submit" style={{ padding: '18px 0', background: 'linear-gradient(90deg, #27ae60 0%, #43cea2 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 900, fontSize: 26, cursor: 'pointer', marginTop: 10, fontFamily: 'Segoe UI, Arial, sans-serif', boxShadow: '0 2px 8px rgba(39,174,96,0.10)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>Enregistrer</button>
        </form>
        {error && <p style={{ color: '#e74c3c', textAlign: 'center', fontWeight: 700, marginTop: 18 }}>{error}</p>}
      </div>
    </div>
  );
}

export default RateForm;
