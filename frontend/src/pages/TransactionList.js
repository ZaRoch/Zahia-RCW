import React, { useEffect, useState } from 'react';
import { getTransactions } from '../api/transaction';
import { getReceiptPDF, getReceiptJSON } from '../api/receipt';
import { updateTransactionStatus } from '../api/transactionStatus';
import { getAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function TransactionList() {
  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState({ clientName: '', service: '', status: '', startDate: '', endDate: '' });
  const navigate = useNavigate();
  const { token, role } = getAuth();

  const handleStatusChange = async (id, status) => {
    try {
      await updateTransactionStatus(id, status, token);
      fetchData(search); 
    } catch (err) {
      alert('Erreur lors du changement de statut');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      await fetchData(search);
    } catch (err) {
      setError('Erreur lors de la recherche');
    }
  };

  const fetchData = async (criteria) => {
    try {
      const params = new URLSearchParams();
      if (criteria.clientName) params.append('clientName', criteria.clientName);
      if (criteria.service) params.append('service', criteria.service);
      if (criteria.status) params.append('status', criteria.status);
      if (criteria.startDate) params.append('startDate', criteria.startDate);
      if (criteria.endDate) params.append('endDate', criteria.endDate);
      const url = params.toString() ? `http://localhost:5000/api/transactions?${params.toString()}` : 'http://localhost:5000/api/transactions';
      const res = await getTransactions(token, url);
      setTransactions(res.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des transactions');
    }
  };

  useEffect(() => {
    fetchData(search);
  }, []);

  const handleDownloadPDF = async (id) => {
    try {
      const res = await getReceiptPDF(id, token);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Erreur lors du téléchargement du PDF');
    }
  };

  const handleDownloadJSON = async (id) => {
    try {
      const res = await getReceiptJSON(id, token);
      const url = window.URL.createObjectURL(new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${id}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Erreur lors du téléchargement du JSON');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', padding: '40px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(44,62,80,0.12)', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button onClick={handleLogout} style={{ padding: '8px 18px', background: 'linear-gradient(90deg, #e74c3c 0%, #f1c40f 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,76,60,0.10)' }}>Déconnexion</button>
        </div>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: 36, fontWeight: 800, fontSize: 36, letterSpacing: 1 }}>Liste des transactions</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 36 }}>
          <button style={{ padding: '12px 28px', background: 'linear-gradient(90deg, #3498db 0%, #6dd5fa 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(52,152,219,0.15)', transition: 'transform 0.2s', outline: 'none' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} onClick={() => navigate('/transactions/new')}>Ajouter une transaction</button>
          <button style={{ padding: '12px 28px', background: 'linear-gradient(90deg, #27ae60 0%, #43cea2 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(39,174,96,0.15)', transition: 'transform 0.2s', outline: 'none' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} onClick={() => navigate('/rates/new')}>Gérer les taux de conversion</button>
          <button style={{ padding: '12px 28px', background: 'linear-gradient(90deg, #e67e22 0%, #f1c40f 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(230,126,34,0.15)', transition: 'transform 0.2s', outline: 'none' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} onClick={() => navigate('/dashboard')}>Aller au dashboard</button>
        </div>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
          <input type="text" placeholder="Nom client" value={search.clientName} onChange={e => setSearch({ ...search, clientName: e.target.value })} style={{ padding: 12, borderRadius: 10, border: '1px solid #b2bec3', minWidth: 140, fontSize: 16, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }} />
          <select value={search.service} onChange={e => setSearch({ ...search, service: e.target.value })} style={{ padding: 12, borderRadius: 10, border: '1px solid #b2bec3', minWidth: 140, fontSize: 16, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }}>
            <option value="">Service</option>
            <option value="RIA">RIA</option>
            <option value="WU">Western Union</option>
            <option value="MG">MoneyGram</option>
          </select>
          <select value={search.status} onChange={e => setSearch({ ...search, status: e.target.value })} style={{ padding: 12, borderRadius: 10, border: '1px solid #b2bec3', minWidth: 140, fontSize: 16, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }}>
            <option value="">Statut</option>
            <option value="en attente">En attente</option>
            <option value="validée">Validée</option>
            <option value="annulée">Annulée</option>
          </select>
          <input type="date" value={search.startDate} onChange={e => setSearch({ ...search, startDate: e.target.value })} style={{ padding: 12, borderRadius: 10, border: '1px solid #b2bec3', fontSize: 16, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }} />
          <input type="date" value={search.endDate} onChange={e => setSearch({ ...search, endDate: e.target.value })} style={{ padding: 12, borderRadius: 10, border: '1px solid #b2bec3', fontSize: 16, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }} />
          <button type="submit" style={{ padding: '12px 28px', background: 'linear-gradient(90deg, #2c3e50 0%, #636e72 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.10)', transition: 'transform 0.2s', outline: 'none' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>Rechercher</button>
        </form>
        {error && <p style={{ color: '#e74c3c', textAlign: 'center', fontWeight: 700 }}>{error}</p>}
        <div style={{ overflowX: 'auto', borderRadius: 16, boxShadow: '0 2px 12px rgba(44,62,80,0.10)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 16, overflow: 'hidden', fontSize: 20, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 0.5 }}>
            <thead style={{ background: 'linear-gradient(90deg, #ecf0f1 0%, #dff9fb 100%)' }}>
              <tr>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Nom client</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Montant initial</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Devise initiale</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Montant converti</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Devise convertie</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Taux</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Service</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Numéro</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Statut</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Date/heure</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Reçus</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#34495e', borderBottom: '2.5px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id} style={{ borderBottom: '1.5px solid #ecf0f1', transition: 'background 0.2s', background: tx.status === 'annulée' ? '#f9ebea' : tx.status === 'validée' ? '#eafaf1' : '#fff', cursor: 'pointer', fontSize: 20, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 0.5 }} onMouseOver={e => e.currentTarget.style.background='#dff9fb'} onMouseOut={e => e.currentTarget.style.background=tx.status === 'annulée' ? '#f9ebea' : tx.status === 'validée' ? '#eafaf1' : '#fff'}>
                  <td style={{ padding: 16 }}>{tx.clientName}</td>
                  <td style={{ padding: 16 }}>{tx.amount}</td>
                  <td style={{ padding: 16 }}>{tx.currency}</td>
                  <td style={{ padding: 16 }}>{tx.convertedAmount ?? '-'}</td>
                  <td style={{ padding: 16 }}>{tx.convertedCurrency ?? '-'}</td>
                  <td style={{ padding: 16 }}>{tx.rate ?? '-'}</td>
                  <td style={{ padding: 16 }}>{tx.service}</td>
                  <td style={{ padding: 16 }}>{tx.transactionNumber}</td>
                  <td style={{ padding: 16, fontWeight: 700, color: tx.status === 'validée' ? '#27ae60' : tx.status === 'annulée' ? '#e74c3c' : '#34495e' }}>{tx.status}</td>
                  <td style={{ padding: 16 }}>{new Date(tx.date).toLocaleString()}</td>
                  <td style={{ padding: 16 }}>
                    <button style={{ padding: '10px 20px', background: 'linear-gradient(90deg, #16a085 0%, #43cea2 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 18, boxShadow: '0 2px 8px rgba(22,160,133,0.10)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.08)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} onClick={() => handleDownloadJSON(tx._id)}>JSON</button>
                  </td>
                  <td style={{ padding: 16 }}>
                    {tx.status !== 'validée' && (
                      <button style={{ padding: '10px 20px', background: 'linear-gradient(90deg, #27ae60 0%, #43cea2 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginRight: 8, fontSize: 18, boxShadow: '0 2px 8px rgba(39,174,96,0.10)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.08)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} onClick={() => handleStatusChange(tx._id, 'validée')}>Valider</button>
                    )}
                    {tx.status !== 'annulée' && (
                      <button style={{ padding: '10px 20px', background: 'linear-gradient(90deg, #e74c3c 0%, #f1c40f 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 18, boxShadow: '0 2px 8px rgba(231,76,60,0.10)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.08)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'} onClick={() => handleStatusChange(tx._id, 'annulée')}>Annuler</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionList;