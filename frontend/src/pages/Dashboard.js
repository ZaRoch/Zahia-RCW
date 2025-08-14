
import React, { useEffect, useState } from 'react';
import ServicePieChart from '../components/ServicePieChart';
import { getDashboardStats } from '../api/dashboard';
import { getAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const { token, role } = getAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };
  
  const totalTransactions = stats ? ((stats.serviceCounts?.MG || 0) + (stats.serviceCounts?.RIA || 0) + (stats.serviceCounts?.WU || 0)) : 0;

  useEffect(() => {
    if (!token || (role !== 'agent' && role !== 'superviseur')) {
      setError('Accès refusé.');
      return;
    }
    async function fetchData() {
      try {
        const res = await getDashboardStats(token);
        setStats(res.data);
      } catch (err) {
        setError('Erreur lors de la récupération des statistiques');
      }
    }
    fetchData();
  }, [token, role]);

  if (error) {
    return <div style={{ color: 'red', fontWeight: 700 }}>{error}</div>;
  }

  if (!stats) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', padding: '40px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(44,62,80,0.12)', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 8 }}>
          <button onClick={handleLogout} style={{ padding: '8px 18px', background: 'linear-gradient(90deg, #e74c3c 0%, #f1c40f 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,76,60,0.10)' }}>Déconnexion</button>
          <button onClick={() => navigate('/transactions')} style={{ padding: '8px 18px', background: 'linear-gradient(90deg, #3498db 0%, #6dd5fa 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(52,152,219,0.10)' }}>Retour à l'historique</button>
        </div>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: 36, fontWeight: 800, fontSize: 36, letterSpacing: 1 }}>Tableau de bord</h2>
  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 16, overflow: 'hidden', fontSize: 16, marginBottom: 32, textAlign: 'center' }}>
          <thead style={{ background: 'linear-gradient(90deg, #ecf0f1 0%, #dff9fb 100%)' }}>
            <tr>
              <th style={{ padding: 14, fontWeight: 800, color: '#34495e', borderBottom: '2px solid #bdc3c7', fontSize: 17 }}>ID</th>
              <th style={{ padding: 14, fontWeight: 800, color: '#34495e', borderBottom: '2px solid #bdc3c7', fontSize: 17 }}>Total envoyé</th>
              <th style={{ padding: 14, fontWeight: 800, color: '#34495e', borderBottom: '2px solid #bdc3c7', fontSize: 17 }}>Total reçu</th>
            </tr>
          </thead>
          <tbody>
            {(stats.stats && Array.isArray(stats.stats)) ? stats.stats.map(s => (
              <tr key={s._id}>
                <td style={{ padding: 12, textAlign: 'center' }}>{s._id}</td>
                <td style={{ padding: 12, textAlign: 'center' }}>{s.totalEnvoye}</td>
                <td style={{ padding: 12, textAlign: 'center' }}>{s.totalRecu ?? '-'}</td>
              </tr>
            )) : null}
          </tbody>
        </table>
        <h3 style={{ color: '#2980b9', fontWeight: 700, fontSize: 24, marginBottom: 18 }}>Total par devise d'origine</h3>
  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 16, overflow: 'hidden', fontSize: 16, marginBottom: 32, textAlign: 'center' }}>
          <thead style={{ background: 'linear-gradient(90deg, #ecf0f1 0%, #dff9fb 100%)' }}>
            <tr>
              <th style={{ padding: 14, fontWeight: 800, color: '#34495e', borderBottom: '2px solid #bdc3c7', fontSize: 17 }}>Devise</th>
              <th style={{ padding: 14, fontWeight: 800, color: '#34495e', borderBottom: '2px solid #bdc3c7', fontSize: 17 }}>Total envoyé</th>
            </tr>
          </thead>
          <tbody>
            {(stats.byCurrency && Array.isArray(stats.byCurrency)) ? stats.byCurrency.map(c => (
              <tr key={c._id}>
                <td style={{ padding: 12, textAlign: 'center' }}>{c._id}</td>
                <td style={{ padding: 12, textAlign: 'center' }}>{c.totalEnvoye}</td>
              </tr>
            )) : null}
          </tbody>
        </table>
        <h3 style={{ color: '#27ae60', fontWeight: 700, fontSize: 24, marginBottom: 18 }}>Total par devise convertie</h3>
  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 16, overflow: 'hidden', fontSize: 16, textAlign: 'center' }}>
          <thead style={{ background: 'linear-gradient(90deg, #ecf0f1 0%, #dff9fb 100%)' }}>
            <tr>
              <th style={{ padding: 14, fontWeight: 800, color: '#34495e', borderBottom: '2px solid #bdc3c7', fontSize: 17 }}>Devise</th>
              <th style={{ padding: 14, fontWeight: 800, color: '#34495e', borderBottom: '2px solid #bdc3c7', fontSize: 17 }}>Total reçu</th>
            </tr>
          </thead>
          <tbody>
            {(stats.byConvertedCurrency && Array.isArray(stats.byConvertedCurrency)) ? stats.byConvertedCurrency.map(c => (
              <tr key={c._id}>
                <td style={{ padding: 12, textAlign: 'center' }}>{c._id ?? '-'}</td>
                <td style={{ padding: 12, textAlign: 'center' }}>{c.totalRecu ?? '-'}</td>
              </tr>
            )) : null}
          </tbody>
        </table>
          <h3 style={{ color: '#8e44ad', fontWeight: 700, fontSize: 24, margin: '32px 0 18px 0', textAlign: 'center' }}>Transactions et totaux par service</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 16, overflow: 'hidden', fontSize: 20, marginBottom: 32, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 0.5, textAlign: 'center' }}>
            <thead style={{ background: 'linear-gradient(90deg, #ecf0f1 0%, #dff9fb 100%)' }}>
              <tr>
                <th style={{ padding: 18, fontWeight: 900, color: '#2c3e50', borderBottom: '2px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Service</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#2c3e50', borderBottom: '2px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Nombre de transactions</th>
                <th style={{ padding: 18, fontWeight: 900, color: '#2c3e50', borderBottom: '2px solid #bdc3c7', fontSize: 22, fontFamily: 'Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>Total envoyé</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: 16, fontWeight: 600, color: '#34495e', fontSize: 20, textAlign: 'center' }}>MoneyGram</td>
                <td style={{ padding: 16, fontWeight: 600, color: '#34495e', fontSize: 20, textAlign: 'center' }}>{stats.serviceCounts?.MG || 0}</td>
                <td style={{ padding: 16, fontWeight: 600, color: '#34495e', fontSize: 20, textAlign: 'center' }}>{(stats.byService?.find(s => s._id === 'MG')?.totalEnvoye || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ padding: 16, fontWeight: 600, color: '#34495e', fontSize: 20, textAlign: 'center' }}>RIA</td>
                <td style={{ padding: 16, fontWeight: 600, color: '#34495e', fontSize: 20, textAlign: 'center' }}>{stats.serviceCounts?.RIA || 0}</td>
                <td style={{ padding: 16, fontWeight: 600, color: '#34495e', fontSize: 20, textAlign: 'center' }}>{(stats.byService?.find(s => s._id === 'RIA')?.totalEnvoye || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ padding: 16, fontWeight: 600, color: '#34495e', fontSize: 20, textAlign: 'center' }}>Western Union</td>
                <td style={{ padding: 16, fontWeight: 600, color: '#34495e', fontSize: 20, textAlign: 'center' }}>{stats.serviceCounts?.WU || 0}</td>
                <td style={{ padding: 16, fontWeight: 600, color: '#34495e', fontSize: 20, textAlign: 'center' }}>{(stats.byService?.find(s => s._id === 'WU')?.totalEnvoye || 0).toLocaleString()}</td>
              </tr>
              <tr style={{ background: '#f4f6fb', fontWeight: 900 }}>
                <td style={{ padding: 16, fontWeight: 900, color: '#2c3e50', fontSize: 22, textAlign: 'center' }}>Total</td>
                <td style={{ padding: 16, fontWeight: 900, color: '#2c3e50', fontSize: 22, textAlign: 'center' }}>{totalTransactions}</td>
                <td style={{ padding: 16, textAlign: 'center' }}></td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>
  );
}

export default Dashboard;
