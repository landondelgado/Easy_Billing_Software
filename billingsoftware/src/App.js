import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Billing from './Billing';
import Agencies from './Agencies';
import Header from './Header';
import Payroll from './Payroll';

function App() {
  const [user, setUser] = useState(null);

  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <Router>
      <div className="App">
        <Header setUser={setUser} />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/billing" />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/agencies" element={<Agencies token={localStorage.getItem('id_token')} />} />
            <Route path="/payroll" element={<Payroll token={localStorage.getItem('id_token')} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
