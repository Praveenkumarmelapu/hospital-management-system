import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { UserPlus, Edit3, Power, X, Save, AlertCircle } from 'lucide-react';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Deactivate Modal State
  const [deactivateModal, setDeactivateModal] = useState({ open: false, doctor: null });
  const [deactivating, setDeactivating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    specialization: '',
    department: '',
    qualification: '',
    experience: 5,
    about: '',
    consultationFee: 500,
    slotDuration: 30,
    status: 'active',
  });

  useEffect(() => {
    fetchDoctorsAndDepartments();
  }, []);

  const fetchDoctorsAndDepartments = async () => {
    try {
      const [docsRes, deptsRes] = await Promise.all([
        api.get('/doctors?includeInactive=true'),
        api.get('/departments'),
      ]);
      setDoctors(docsRes.data);
      setDepartments(deptsRes.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      profileImage: '',
      specialization: '',
      department: departments[0]?._id || '',
      qualification: '',
      experience: 5,
      about: '',
      consultationFee: 500,
      slotDuration: 30,
      status: 'active',
    });
    setModalError('');
    setDoctorModalOpen(true);
  };

  const handleOpenEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      profileImage: doctor.profileImage || '',
      specialization: doctor.specialization || '',
      department: typeof doctor.department === 'object' ? doctor.department?._id : doctor.department || '',
      qualification: doctor.qualification || '',
      experience: doctor.experience || 0,
      about: doctor.about || '',
      consultationFee: doctor.consultationFee || 500,
      slotDuration: doctor.slotDuration || 30,
      status: doctor.status || 'active',
    });
    setModalError('');
    setDoctorModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSaving(true);

    try {
      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor._id}`, formData);
      } else {
        await api.post('/doctors', formData);
      }
      setDoctorModalOpen(false);
      fetchDoctorsAndDepartments();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save doctor details');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!deactivateModal.doctor) return;
    setDeactivating(true);
    try {
      await api.delete(`/doctors/${deactivateModal.doctor._id}`);
      setDeactivateModal({ open: false, doctor: null });
      fetchDoctorsAndDepartments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate doctor');
    } finally {
      setDeactivating(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading doctor records..." />;

  const defaultImg = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80';

  return (
    <div className="admin-doctors-page animate-fade-in">
      <div className="page-header-flex mb-4">
        <div>
          <h2>Doctor Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Add new doctors, edit profiles, update consultation schedules, and manage status
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
          <UserPlus size={16} /> Add New Doctor
        </button>
      </div>

      {/* Doctors Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization & Dept</th>
              <th>Qualification</th>
              <th>Exp / Fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={doc.profileImage || defaultImg}
                      alt={doc.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = defaultImg; }}
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>{doc.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{doc.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{doc.specialization}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{doc.department?.name || 'Department'}</div>
                </td>
                <td>{doc.qualification}</td>
                <td>
                  <div>{doc.experience} Yrs Exp.</div>
                  <div style={{ fontWeight: 700, color: 'var(--success)' }}>₹{doc.consultationFee}</div>
                </td>
                <td>
                  <StatusBadge status={doc.status} />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleOpenEdit(doc)}
                      className="btn btn-secondary btn-sm"
                      title="Edit Doctor"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    {doc.status === 'active' && (
                      <button
                        onClick={() => setDeactivateModal({ open: true, doctor: doc })}
                        className="btn btn-danger btn-sm"
                        title="Deactivate Doctor"
                      >
                        <Power size={14} /> Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Doctor Modal */}
      {doctorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>{editingDoctor ? 'Edit Doctor Profile' : 'Add New Specialist Doctor'}</h3>
              <button onClick={() => setDoctorModalOpen(false)} style={{ background: 'none', border: 'none' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {modalError && (
                  <div className="alert-error-banner mb-3">
                    <AlertCircle size={18} />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Doctor Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Department *</label>
                    <select
                      className="form-control"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dep) => (
                        <option key={dep._id} value={dep._id}>
                          {dep.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Specialization *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Senior Cardiologist"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Qualification *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. MBBS, MD, DM"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Years of Experience *</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Consultation Fee (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      required
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Profile Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://..."
                    value={formData.profileImage}
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>About Doctor</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setDoctorModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Confirm */}
      <ConfirmDialog
        isOpen={deactivateModal.open}
        title="Deactivate Doctor?"
        message={`Are you sure you want to deactivate ${deactivateModal.doctor?.name}? Deactivating hides the doctor from new bookings while preserving all previous appointment history in MongoDB.`}
        confirmText="Deactivate Doctor"
        loading={deactivating}
        onConfirm={handleDeactivateConfirm}
        onCancel={() => setDeactivateModal({ open: false, doctor: null })}
      />

      <style>{`
        .mb-3 { margin-bottom: 1rem; }
        .mb-4 { margin-bottom: 1.75rem; }
        .page-header-flex { display: flex; align-items: center; justify-content: space-between; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .alert-error-banner {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
        }
        @media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default AdminDoctors;
