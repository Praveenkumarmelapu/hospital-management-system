import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  ChevronRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todaysAppointments: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [apptsRes, docsRes, ptsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/doctors?includeInactive=true'),
        api.get('/patients'),
      ]);

      const allAppts = apptsRes.data;
      const todayStr = new Date().toISOString().split('T')[0];

      const todayAppts = allAppts.filter((a) => a.appointmentDate === todayStr);

      setStats({
        totalPatients: ptsRes.data.length,
        totalDoctors: docsRes.data.length,
        todaysAppointments: todayAppts.length,
        pending: allAppts.filter((a) => a.status === 'Pending').length,
        confirmed: allAppts.filter((a) => a.status === 'Confirmed').length,
        completed: allAppts.filter((a) => a.status === 'Completed').length,
        cancelled: allAppts.filter((a) => a.status === 'Cancelled').length,
      });

      setRecentAppointments(allAppts.slice(0, 5));
      setRecentPatients(ptsRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin analytics..." />;

  return (
    <div className="admin-dashboard animate-fade-in">
      <div className="mb-4">
        <h2>Hospital Executive Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time metrics, appointment schedules, and patient management
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="admin-stats-grid mb-4">
        <div className="card stat-box">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Users size={24} />
          </div>
          <div>
            <span className="num">{stats.totalPatients}</span>
            <span className="lbl">Total Patients</span>
          </div>
        </div>

        <div className="card stat-box">
          <div className="stat-icon" style={{ background: '#ccfbf1', color: '#0d9488' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <span className="num">{stats.totalDoctors}</span>
            <span className="lbl">Active Doctors</span>
          </div>
        </div>

        <div className="card stat-box">
          <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            <Calendar size={24} />
          </div>
          <div>
            <span className="num">{stats.todaysAppointments}</span>
            <span className="lbl">Today's Schedule</span>
          </div>
        </div>

        <div className="card stat-box">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <span className="num">{stats.pending}</span>
            <span className="lbl">Pending Action</span>
          </div>
        </div>
      </div>

      {/* Breakdown Bar */}
      <div className="card breakdown-card mb-4">
        <h4>Status Overview:</h4>
        <div className="status-pills">
          <span className="pill-stat badge-pending">Pending: {stats.pending}</span>
          <span className="pill-stat badge-confirmed">Confirmed: {stats.confirmed}</span>
          <span className="pill-stat badge-completed">Completed: {stats.completed}</span>
          <span className="pill-stat badge-cancelled">Cancelled: {stats.cancelled}</span>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="card p-4 mb-4">
        <div className="card-header-flex mb-3">
          <h3>Recent Appointments</h3>
          <Link to="/admin/appointments" className="btn btn-secondary btn-sm">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appt) => (
                <tr key={appt._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{appt.patient?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{appt.patient?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{appt.doctor?.name}</div>
                  </td>
                  <td>{appt.department?.name}</td>
                  <td>
                    {appt.appointmentDate} at <strong>{appt.appointmentTime}</strong>
                  </td>
                  <td>
                    <StatusBadge status={appt.status} />
                  </td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
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
      </div>

      <style>{`
        .mb-3 { margin-bottom: 1rem; }
        .mb-4 { margin-bottom: 1.75rem; }
        .p-4 { padding: 1.5rem !important; }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .stat-box {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .num {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--dark);
          line-height: 1.1;
          display: block;
        }
        .lbl {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .breakdown-card {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .status-pills {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .pill-stat {
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 700;
        }
        .card-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        @media (max-width: 992px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .admin-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
