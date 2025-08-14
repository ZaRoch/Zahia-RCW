
import React, { useState, useEffect } from 'react';
import { createTransaction } from '../api/transaction';
import { getAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function TransactionForm() {
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [convertedCurrency, setConvertedCurrency] = useState('');
  const [service, setService] = useState('RIA');
  const [transactionNumber, setTransactionNumber] = useState('');
  const [message, setMessage] = useState('');
  const [rate, setRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const navigate = useNavigate();
  const { token, role } = getAuth();
    const handleLogout = () => {
      localStorage.removeItem('auth');
      navigate('/login');
    };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  
  useEffect(() => {
    const fetchRate = async () => {
      if (
        currency &&
        convertedCurrency &&
        currency !== convertedCurrency &&
        amount > 0
      ) {
        try {
          const res = await fetch(`http://localhost:5000/api/rates?from=${currency}&to=${convertedCurrency}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data && data.rate) {
            setRate(data.rate);
            setConvertedAmount((parseFloat(amount) * parseFloat(data.rate)).toFixed(2));
          } else {
            setRate(null);
            setConvertedAmount(null);
          }
        } catch {
          setRate(null);
          setConvertedAmount(null);
        }
      } else {
        setRate(null);
        setConvertedAmount(null);
      }
    };
    fetchRate();
  }, [currency, convertedCurrency, amount, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === 'client') {
      setMessage("Votre demande de transaction a été envoyée. Un agent ou superviseur la traitera.");
      
      return;
    }
    try {
      const res = await createTransaction({ clientName, amount, currency, convertedCurrency, service, transactionNumber }, token);
      let msg = 'Transaction enregistrée.';
      if (res.data.alerts && res.data.alerts.length > 0) {
        msg += ' Alertes : ' + res.data.alerts.join(' | ');
      }
      setMessage(msg);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', padding: '40px 0' }}>
  <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(44,62,80,0.12)', padding: 32, fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: 22, letterSpacing: 0.5 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button onClick={handleLogout} style={{ padding: '8px 18px', background: 'linear-gradient(90deg, #e74c3c 0%, #f1c40f 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,76,60,0.10)' }}>Déconnexion</button>
        </div>
  <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: 32, fontWeight: 900, fontSize: 38, letterSpacing: 1, fontFamily: 'Segoe UI, Arial, sans-serif' }}>Nouvelle transaction</h2>
  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22, background: 'linear-gradient(90deg, #f8f9fa 0%, #e0eafc 100%)', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(44,62,80,0.06)', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 0.5 }}>
          <input type="text" placeholder="Nom client" value={clientName} onChange={e => setClientName(e.target.value)} required style={{ padding: 16, borderRadius: 8, border: '1px solid #b2bec3', fontSize: 22, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)', fontFamily: 'Segoe UI, Arial, sans-serif' }} />
          <input type="number" placeholder="Montant" value={amount} onChange={e => setAmount(e.target.value)} required style={{ padding: 16, borderRadius: 8, border: '1px solid #b2bec3', fontSize: 22, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)', fontFamily: 'Segoe UI, Arial, sans-serif' }} />
          <div style={{ display: 'flex', gap: 16 }}>
            <input type="text" placeholder="Devise initiale (ex: EUR, USD, MAD, CAD)" value={currency} onChange={e => setCurrency(e.target.value)} required list="currencies" style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #b2bec3', fontSize: 16, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)', fontFamily: 'Segoe UI, Arial, sans-serif' }} />
            <input type="text" placeholder="Devise de conversion (ex: EUR, USD, MAD, CAD)" value={convertedCurrency} onChange={e => setConvertedCurrency(e.target.value)} required list="currencies" style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #b2bec3', fontSize: 16, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)', fontFamily: 'Segoe UI, Arial, sans-serif' }} />
            <datalist id="currencies">
              <option value="EUR" />
              <option value="USD" />
              <option value="MAD" />
              <option value="CAD" />
            </datalist>
          </div>
          <div style={{ margin: '1em 0', background: '#f4f6fb', borderRadius: 8, padding: 16, fontWeight: 700, color: '#34495e', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }}>
            <strong>Taux de conversion :</strong> {rate !== null ? rate : 'Non trouvé'}<br />
            <strong>Nouveau prix :</strong> {convertedAmount !== null ? convertedAmount : '-'}
          </div>
          <select value={service} onChange={e => setService(e.target.value)} required style={{ padding: 16, borderRadius: 8, border: '1px solid #b2bec3', fontSize: 22, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
            <option value="RIA">RIA</option>
            <option value="WU">Western Union</option>
            <option value="MG">MoneyGram</option>
          </select>
          <input type="text" placeholder="Numéro de transaction" value={transactionNumber} onChange={e => setTransactionNumber(e.target.value)} required style={{ padding: 16, borderRadius: 8, border: '1px solid #b2bec3', fontSize: 22, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)', fontFamily: 'Segoe UI, Arial, sans-serif' }} />
          <button type="submit" style={{ padding: '18px 0', background: 'linear-gradient(90deg, #27ae60 0%, #43cea2 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 900, fontSize: 26, cursor: 'pointer', marginTop: 10, fontFamily: 'Segoe UI, Arial, sans-serif', boxShadow: '0 2px 8px rgba(39,174,96,0.10)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.04)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>Enregistrer</button>
        </form>
  <button onClick={() => navigate('/transactions')} style={{ marginTop: 18, padding: '14px 28px', background: 'linear-gradient(90deg, #3498db 0%, #6dd5fa 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 900, fontSize: 22, cursor: 'pointer', fontFamily: 'Segoe UI, Arial, sans-serif', boxShadow: '0 2px 8px rgba(52,152,219,0.10)' }}>Retour à l'historique</button>
        {message && <p style={{ color: message.includes('Erreur') ? '#e74c3c' : '#27ae60', textAlign: 'center', fontWeight: 700, marginTop: 18 }}>{message}</p>}
      </div>
    </div>
  );
}

export default TransactionForm;
