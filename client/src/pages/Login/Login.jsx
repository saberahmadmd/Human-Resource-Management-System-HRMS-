import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/employees');
    } catch (err) {
      console.log(err)
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back 👋</h2>
        <p className="auth-subtitle">Sign in to manage employees and teams.</p>

        {error && <div className="login-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              className="auth-input"
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              className="auth-input"
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-footer-text">
          Don&apos;t have an organisation?{' '}
          <Link className="auth-link" to="/register">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
