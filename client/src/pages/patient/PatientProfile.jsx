import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, Mail, Phone, Calendar, MapPin, Save, CheckCircle2, AlertCircle } from 'lucide-react';

const PatientProfile = () => {
  const { currentUser, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
    gender: currentUser?.gender || 'Male',
    address: currentUser?.address || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setSaving(true);

    try {
      const res = await api.put(`/patients/${currentUser._id}`, {
        name: form.name,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        address: form.address,
      });

      updateUser(res.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="patient-profile-page animate-fade-in">
      <div className="mb-4">
        <h2>My Patient Profile</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Update your personal contact details and demographics
        </p>
      </div>

      {success && (
        <div className="alert-success-banner mb-4">
          <CheckCircle2 size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert-error-banner mb-4">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="card p-4" style={{ maxWidth: '680px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              className="form-control"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Email Address (Read Only)</label>
              <input type="email" className="form-control" disabled value={form.email} />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              />
            </div>

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
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      <style>{`
        .p-4 { padding: 2rem !important; }
        .mb-4 { margin-bottom: 1.5rem; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .alert-success-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: #d1fae5;
          color: #047857;
          border: 1px solid #6ee7b7;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        .alert-error-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fca5a5;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        @media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default PatientProfile;
