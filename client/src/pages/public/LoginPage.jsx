import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import hospitalConfig from '../../utils/hospitalConfig';
import { Lock, Mail, Cross, LogIn, AlertCircle, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      if (from) {
        navigate(from, { replace: true });
      } else if (result.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/patient/dashboard', { replace: true });
      }
    } else {
      setError(result.message);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@hospital.com');
    setPassword('Admin@123');
  };

  const fillDemoPatient = () => {
    setEmail('patient@gmail.com');
    setPassword('Patient@123');
  };

  return (
    <div className="login-page bg-light" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card login-card animate-fade-in">
          <div className="login-header text-center">
            <div className="logo-circle">
              <Cross size={28} />
            </div>
            <h2>Account Login</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Access CarePlus Patient & Admin Management Portals
            </p>
          </div>

          {/* Quick Viva Demo Fill Helper */}
          <div className="demo-credentials-box">
            <div className="demo-header">
              <Sparkles size={15} /> Academic Demo Quick Fill:
            </div>
            <div className="demo-buttons">
              <button type="button" onClick={fillDemoPatient} className="btn btn-secondary btn-sm">
                Patient Demo
              </button>
              <button type="button" onClick={fillDemoAdmin} className="btn btn-secondary btn-sm">
                Admin Demo
              </button>
            </div>
          </div>

          {error && (
            <div className="alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-control padded-input"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-control padded-input"
                  placeholder="Enter password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <LogIn size={18} /> {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer text-center" style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Don't have a patient account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Register as Patient
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .login-card { padding: 2.25rem; }
        .logo-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
        }
        .demo-credentials-box {
          background-color: var(--primary-light);
          border: 1px solid #bae6fd;
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          margin-bottom: 1.5rem;
        }
        .demo-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--primary-hover);
          margin-bottom: 0.5rem;
        }
        .demo-buttons {
          display: flex;
          gap: 0.5rem;
        }
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
        .input-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }
        .padded-input {
          padding-left: 2.5rem;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
