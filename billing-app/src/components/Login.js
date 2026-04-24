import React, { useState } from 'react';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Cashier');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const body = isLogin ? { username, password } : { username, password, role };

    try {
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      if (isLogin) {
        onLogin(data.user);
      } else {
        alert('Account created successfully! You can now log in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            className={`pay-method-btn ${isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Sign In
          </button>
          <button 
            className={`pay-method-btn ${!isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          {isLogin ? 'Please enter your credentials to access the system.' : 'Register a new user account.'}
        </p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: '600' }}>Username</label>
            <input 
              type="text" 
              className="professional-input" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: '600' }}>Password</label>
            <input 
              type="password" 
              className="professional-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          {!isLogin && (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600' }}>Role</label>
              <select 
                className="professional-input" 
                value={role} 
                onChange={e => setRole(e.target.value)}
              >
                <option value="Cashier">Cashier</option>
                <option value="Manager">Manager</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>
          )}

          <button type="submit" className="primary-btn">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
