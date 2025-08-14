
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TransactionForm from './pages/TransactionForm';
import TransactionList from './pages/TransactionList';
import RateForm from './pages/RateForm';
import RateList from './pages/RateList';
import AlertList from './pages/AlertList';
import Dashboard from './pages/Dashboard';

import { Link } from 'react-router-dom';
function Home() {
  return (
    <div>
      <h1>Bienvenue sur la gestion des transactions numériques</h1>
      <p>Veuillez vous connecter ou vous inscrire pour accéder aux fonctionnalités.</p>
      <div style={{ marginTop: '2em' }}>
        <Link to="/login"><button>Connexion</button></Link>
        <Link to="/register" style={{ marginLeft: '1em' }}><button>Inscription</button></Link>
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <div style={{ width: '100%', background: 'linear-gradient(90deg, #2980b9 0%, #6dd5fa 100%)', padding: '18px 0', marginBottom: 0, boxShadow: '0 2px 8px rgba(44,62,80,0.10)', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: '#fff', textAlign: 'center', fontWeight: 900, fontSize: 32, letterSpacing: 2, margin: 0, fontFamily: 'Segoe UI, Arial, sans-serif' }}>RCW - Zahia</h1>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transactions/new" element={<TransactionForm />} />
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/rates/new" element={<RateForm />} />
        <Route path="/rates" element={<RateList />} />
        <Route path="/alerts" element={<AlertList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
