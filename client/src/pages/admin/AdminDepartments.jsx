import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Building2, PlusCircle, Edit3, Power, X, Save, AlertCircle } from 'lucide-react';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '', status: 'active' });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Deactivate
  const [deactivateModal, setDeactivateModal] = useState({ open: false, dept: null });
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments?includeInactive=true');
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingDept(null);
    setFormData({ name: '', description: '', image: '', status: 'active' });
    setModalError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description,
      image: dept.image || '',
      status: dept.status || 'active',
    });
    setModalError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSaving(true);
    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept._id}`, formData);
      } else {
        await api.post('/departments', formData);
      }
      setModalOpen(false);
      fetchDepartments();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save department');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!deactivateModal.dept) return;
    setDeactivating(true);
    try {
      await api.delete(`/departments/${deactivateModal.dept._id}`);
      setDeactivateModal({ open: false, dept: null });
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate department');
    } finally {
      setDeactivating(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching clinical departments..." />;

  const defaultImg = 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="admin-departments-page animate-fade-in">
      <div className="page-header-flex mb-4">
        <div>
          <h2>Department Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Add, update, or deactivate hospital clinical departments
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
          <PlusCircle size={16} /> Add Department
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={dept.image || defaultImg}
                      alt={dept.name}
                      style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = defaultImg; }}
                    />
                    <div style={{ fontWeight: 700 }}>{dept.name}</div>
                  </div>
                </td>
                <td style={{ maxWidth: '350px', fontSize: '0.88rem' }}>{dept.description}</td>
                <td>
                  <StatusBadge status={dept.status} />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => handleOpenEdit(dept)} className="btn btn-secondary btn-sm">
                      <Edit3 size={14} /> Edit
                    </button>
                    {dept.status === 'active' && (
                      <button
                        onClick={() => setDeactivateModal({ open: true, dept })}
                        className="btn btn-danger btn-sm"
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

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3>{editingDept ? 'Edit Clinical Department' : 'Add Clinical Department'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {modalError && (
                  <div className="alert-error-banner mb-3">
                    <AlertCircle size={18} />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label>Department Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. Cardiology"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Department Description *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    required
                    placeholder="Describe clinical services offered..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Confirm */}
      <ConfirmDialog
        isOpen={deactivateModal.open}
        title="Deactivate Department?"
        message={`Are you sure you want to deactivate ${deactivateModal.dept?.name}?`}
        confirmText="Deactivate"
        loading={deactivating}
        onConfirm={handleDeactivateConfirm}
        onCancel={() => setDeactivateModal({ open: false, dept: null })}
      />

      <style>{`
        .mb-3 { margin-bottom: 1rem; }
        .mb-4 { margin-bottom: 1.75rem; }
        .page-header-flex { display: flex; align-items: center; justify-content: space-between; }
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
      `}</style>
    </div>
  );
};

export default AdminDepartments;
