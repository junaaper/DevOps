import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [page, setPage] = useState('login');

  const handleAuth = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setToken(token);
    setUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setPage('login');
  };

  if (token) return <TodoList token={token} username={username} onLogout={handleLogout} />;

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <h1>TodoApp</h1>
        </div>
        <div className="tab-switcher">
          <button className={page === 'login' ? 'active' : ''} onClick={() => setPage('login')}>Sign In</button>
          <button className={page === 'register' ? 'active' : ''} onClick={() => setPage('register')}>Register</button>
        </div>
        {page === 'login'
          ? <Login onAuth={handleAuth} />
          : <Register onAuth={handleAuth} />
        }
      </div>
    </div>
  );
}

export default App;