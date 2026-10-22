import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { Search, Eye, X, Calendar, UserCheck } from 'lucide-react';

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Patient detail modal
  const [selectedPatientModal, setSelectedPatientModal] = useState({ open: false, data: null });
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    try {
      const res = await api.get(`/patients?search=${encodeURIComponent(search)}`);
      setPatients(res.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatientDetail = async (patientId) => {
    setModalLoading(true);
    setSelectedPatientModal({ open: true, data: null });
    try {
      const res = await api.get(`/patients/${patientId}`);
      setSelectedPatientModal({ open: true, data: res.data });
    } catch (err) {
      alert('Failed to load patient history');
      setSelectedPatientModal({ open: false, data: null });
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching registered patient database..." />;

  return (
    <div className="admin-patients-page animate-fade-in">
      <div className="mb-4">
        <h2>Registered Patient Database</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          View registered patients, contact information, and consultation history
        </p>
      </div>

      {/* Search Card */}
      <div className="card p-4 mb-4" style={{ maxWidth: '450px' }}>
        <div className="form-group mb-0">
          <label><Search size={14} /> Search Patient</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Contact Details</th>
              <th>Gender & DOB</th>
              <th>Appointments</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((pt) => (
              <tr key={pt._id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{pt.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Reg: {new Date(pt.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div>{pt.email}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{pt.phone}</div>
                </td>
                <td>
                  <div>{pt.gender || '-'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {pt.dateOfBirth ? pt.dateOfBirth : '-'}
                  </div>
                </td>
                <td>
                  <span className="badge badge-confirmed" style={{ fontSize: '0.85rem' }}>
                    {pt.appointmentCount} Appointments
                  </span>
                </td>
                <td>
                  <StatusBadge status={pt.status} />
                </td>
                <td>
                  <button
                    onClick={() => handleViewPatientDetail(pt._id)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Eye size={14} /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedPatientModal.open && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Patient Profile & Consultation History</h3>
              <button
                onClick={() => setSelectedPatientModal({ open: false, data: null })}
                style={{ background: 'none', border: 'none' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {modalLoading || !selectedPatientModal.data ? (
                <LoadingSpinner text="Loading patient record..." />
              ) : (
                <div>
                  <div className="patient-meta-box mb-4">
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                      {selectedPatientModal.data.patient?.name}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Email: <strong>{selectedPatientModal.data.patient?.email}</strong> | Phone: <strong>{selectedPatientModal.data.patient?.phone}</strong>
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Address: {selectedPatientModal.data.patient?.address || 'Not Provided'}
                    </p>
                  </div>

                  <h4 style={{ marginBottom: '0.75rem' }}>Appointment History ({selectedPatientModal.data.appointments?.length})</h4>

                  {selectedPatientModal.data.appointments?.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No appointments recorded for this patient.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Doctor</th>
                            <th>Date & Slot</th>
                            <th>Reason</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPatientModal.data.appointments.map((a) => (
                            <tr key={a._id}>
                              <td>
                                <div style={{ fontWeight: 600 }}>{a.doctor?.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{a.doctor?.specialization}</div>
                              </td>
                              <td>
                                {a.appointmentDate} at {a.appointmentTime}
                              </td>
                              <td style={{ fontSize: '0.85rem' }}>{a.reason}</td>
                              <td>
                                <StatusBadge status={a.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .mb-0 { margin-bottom: 0 !important; }
        .mb-4 { margin-bottom: 1.75rem; }
        .p-4 { padding: 1.5rem !important; }
        .patient-meta-box {
          background-color: var(--bg-light);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          border-left: 4px solid var(--primary);
        }
      `}</style>
    </div>
  );
};

export default AdminPatients;
