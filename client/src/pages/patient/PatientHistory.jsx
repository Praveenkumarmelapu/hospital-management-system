import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { History, Filter, Calendar } from 'lucide-react';

const PatientHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/appointments/my');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointment history:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (statusFilter === 'All') return true;
    return appt.status.toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) return <LoadingSpinner text="Loading appointment history..." />;

  const filterTabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  return (
    <div className="patient-history-page animate-fade-in">
      <div className="mb-4">
        <h2>Appointment History</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Full record of your past and present hospital consultations
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs mb-4">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${statusFilter === tab ? 'active' : ''}`}
            onClick={() => setStatusFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="card text-center p-5">
          <History size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
          <h3>No Records Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>No appointment records found under status "{statusFilter}".</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <tr key={appt._id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{appt.doctor?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{appt.doctor?.specialization}</div>
                  </td>
                  <td>{appt.department?.name}</td>
                  <td style={{ fontWeight: 600 }}>{appt.appointmentDate}</td>
                  <td>{appt.appointmentTime}</td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {appt.reason}
                  </td>
                  <td>
                    <StatusBadge status={appt.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .mb-4 { margin-bottom: 1.75rem; }
        .p-5 { padding: 3.5rem !important; }
        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          background: #ffffff;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          overflow-x: auto;
        }
        .tab-btn {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-sm);
          background: transparent;
          font-weight: 600;
          font-size: 0.88rem;
          color: var(--text-muted);
          transition: var(--transition);
        }
        .tab-btn.active {
          background-color: var(--primary);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default PatientHistory;
