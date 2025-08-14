
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

function Register() {
    const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem('auth');
      navigate('/login');
    };
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(fullName, email, password, role);
      setError('Inscription réussie. Connectez-vous.');
    } catch (err) {
      setError('Erreur lors de l\'inscription');
    }
  };
    return (
      <div style={{ maxWidth: 400, margin: '60px auto', padding: 32, background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', borderRadius: 20, boxShadow: '0 8px 32px rgba(44,62,80,0.12)' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: 32, fontWeight: 700, fontSize: 32, letterSpacing: 1 }}>Inscription</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <input type="text" placeholder="Nom complet" value={fullName} onChange={e => setFullName(e.target.value)} style={{ padding: 14, borderRadius: 10, border: '1px solid #b2bec3', fontSize: 17, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 14, borderRadius: 10, border: '1px solid #b2bec3', fontSize: 17, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: 14, borderRadius: 10, border: '1px solid #b2bec3', fontSize: 17, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }} />
          <select value={role} onChange={e => setRole(e.target.value)} style={{ padding: 14, borderRadius: 10, border: '1px solid #b2bec3', fontSize: 17, background: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.04)' }}>
            <option value="">Sélectionner le rôle</option>
            <option value="client">Client</option>
            <option value="agent">Agent</option>
            <option value="superviseur">Superviseur</option>
          </select>
          <button type="submit" style={{ padding: '14px 0', background: 'linear-gradient(90deg, #27ae60 0%, #43cea2 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 19, cursor: 'pointer', marginTop: 10, boxShadow: '0 2px 8px rgba(39,174,96,0.10)' }}>S'inscrire</button>
        </form>
        <button onClick={() => navigate('/login')} style={{ marginTop: 24, width: '100%', padding: '12px 0', background: 'linear-gradient(90deg, #3498db 0%, #6dd5fa 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 17, cursor: 'pointer', boxShadow: '0 2px 8px rgba(52,152,219,0.10)' }}>Déjà inscrit ? Se connecter</button>
        {error && <p style={{ color: '#e74c3c', textAlign: 'center', fontWeight: 600, marginTop: 18 }}>{error}</p>}
      </div>
    );
}

export default Register;
