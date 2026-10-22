import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Lock, Calendar, MapPin, UserPlus, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      address: form.address,
    });
    setLoading(false);

    if (result.success) {
      navigate('/patient/dashboard', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="register-page bg-light" style={{ minHeight: '85vh', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="card register-card animate-fade-in">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h1 className="section-title" style={{ fontSize: '2rem' }}>Patient Registration</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Create an account to manage appointments and view consultation history
            </p>
          </div>

          {error && (
            <div className="alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-icon-wrap">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-control padded-input"
                    placeholder="John Doe"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-icon-wrap">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    className="form-control padded-input"
                    placeholder="patient@gmail.com"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Phone Number *</label>
                <div className="input-icon-wrap">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    className="form-control padded-input"
                    placeholder="+91 98765 43210"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <div className="input-icon-wrap">
                  <Calendar size={18} className="input-icon" />
                  <input
                    type="date"
                    className="form-control padded-input"
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Gender</label>
                <select
                  className="form-control"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address</label>
                <div className="input-icon-wrap">
                  <MapPin size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-control padded-input"
                    placeholder="City, State"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Password *</label>
                <div className="input-icon-wrap">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    className="form-control padded-input"
                    placeholder="Min 6 characters"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <div className="input-icon-wrap">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    className="form-control padded-input"
                    placeholder="Re-enter password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1.25rem' }}>
              <UserPlus size={18} /> {loading ? 'Registering Account...' : 'Complete Patient Registration'}
            </button>
          </form>

          <div className="text-center" style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Already registered?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .register-card { padding: 2.5rem; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .alert-error {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background-color: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fca5a5;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          margin-bottom: 1.25rem;
        }
        .input-icon-wrap { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 12px; color: var(--text-muted); }
        .padded-input { padding-left: 2.5rem; }
        @media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default RegisterPage;
