import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser({
        name: '',
        location: '',
        crop: '',
        tier: 'Free',
        queries: 10
      });
    }
  }, []);

  if (!user) return null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard user={user} setUser={setUser} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;