import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterOrg.css';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RegisterOrg() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    orgName: '',
    adminName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/employees');
    } catch (err) {
      console.log(err)
      setError('Registration failed. Maybe email already exists?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create organisation</h2>
        <p className="auth-subtitle">
          Set up your HR workspace to manage employees and teams.
        </p>

        {error && <div className="register-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="orgName">Organisation name</label>
            <input
              className="auth-input"
              id="orgName"
              name="orgName"
              value={form.orgName}
              onChange={handleChange}
              placeholder="Acme Tutoring"
              required
            />
          </div>
          <div>
            <label htmlFor="adminName">Admin name</label>
            <input
              className="auth-input"
              id="adminName"
              name="adminName"
              value={form.adminName}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
            />
          </div>
          <div>
            <label htmlFor="email">Admin email</label>
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
            {loading ? 'Creating…' : 'Create organisation'}
          </button>
        </form>

        <div className="auth-footer-text">
          Already have an account?{' '}
          <Link className="auth-link" to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
