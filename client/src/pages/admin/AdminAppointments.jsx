import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { Calendar, Filter, Search, RefreshCw } from 'lucide-react';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [apptsRes, docsRes, deptsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/doctors?includeInactive=true'),
        api.get('/departments'),
      ]);
      setAppointments(apptsRes.data);
      setDoctors(docsRes.data);
      setDepartments(deptsRes.data);
    } catch (err) {
      console.error('Error fetching admin appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: newStatus });
      fetchInitialData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (statusFilter !== 'All' && appt.status !== statusFilter) return false;
    if (doctorFilter && appt.doctor?._id !== doctorFilter) return false;
    if (departmentFilter && appt.department?._id !== departmentFilter) return false;
    if (dateFilter && appt.appointmentDate !== dateFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const patientMatch = appt.patient?.name?.toLowerCase().includes(q);
      const docMatch = appt.doctor?.name?.toLowerCase().includes(q);
      const reasonMatch = appt.reason?.toLowerCase().includes(q);
      if (!patientMatch && !docMatch && !reasonMatch) return false;
    }
    return true;
  });

  const resetFilters = () => {
    setStatusFilter('All');
    setDoctorFilter('');
    setDepartmentFilter('');
    setDateFilter('');
    setSearchQuery('');
  };

  if (loading) return <LoadingSpinner text="Fetching all appointments..." />;

  return (
    <div className="admin-appointments-page animate-fade-in">
      <div className="mb-4">
        <h2>Appointment Management</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Filter, review, and update patient appointment statuses
        </p>
      </div>

      {/* Filter Card */}
      <div className="card p-4 mb-4">
        <div className="filter-grid-5">
          <div className="form-group mb-0">
            <label><Search size={13} /> Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Patient or Doctor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="form-group mb-0">
            <label><Filter size={13} /> Status</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group mb-0">
            <label>Doctor</label>
            <select
              className="form-control"
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
            >
              <option value="">All Doctors</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-0">
            <label>Department</label>
            <select
              className="form-control"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mb-0">
            <label>Date</label>
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={resetFilters} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredAppointments.length === 0 ? (
        <div className="card text-center p-5">
          <Calendar size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
          <h3>No Appointments Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>No records match your selected filter criteria.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <tr key={appt._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{appt.patient?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{appt.patient?.phone}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{appt.patient?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{appt.doctor?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{appt.doctor?.specialization}</div>
                  </td>
                  <td>{appt.department?.name}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{appt.appointmentDate}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{appt.appointmentTime}</div>
                  </td>
                  <td style={{ maxWidth: '220px' }}>{appt.reason}</td>
                  <td>
                    <StatusBadge status={appt.status} />
                  </td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
                      value={appt.status}
                      onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .mb-0 { margin-bottom: 0 !important; }
        .mb-4 { margin-bottom: 1.75rem; }
        .p-4 { padding: 1.5rem !important; }
        .p-5 { padding: 3.5rem !important; }
        .filter-grid-5 {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1100px) {
          .filter-grid-5 { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .filter-grid-5 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminAppointments;
