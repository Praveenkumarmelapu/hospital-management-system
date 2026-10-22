import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Stethoscope,
  PlusCircle,
  History,
  User,
  AlertCircle,
} from 'lucide-react';

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ open: false, apptId: null });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/my');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching patient appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelModal.apptId) return;
    setCancelling(true);
    try {
      await api.put(`/appointments/${cancelModal.apptId}/cancel`);
      setCancelModal({ open: false, apptId: null });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading patient dashboard..." />;

  // Calculate metrics
  const total = appointments.length;
  const upcoming = appointments.filter(
    (a) => a.status === 'Pending' || a.status === 'Confirmed'
  );
  const completed = appointments.filter((a) => a.status === 'Completed').length;
  const cancelled = appointments.filter((a) => a.status === 'Cancelled').length;

  const nextAppointment = upcoming.length > 0 ? upcoming[0] : null;

  return (
    <div className="patient-dashboard animate-fade-in">
      {/* Welcome Banner */}
      <div className="card welcome-banner mb-4">
        <div>
          <h2>Welcome back, {currentUser?.name}!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your hospital consultation schedule, view medical history, or book new appointments.
          </p>
        </div>
        <Link to="/patient/book" className="btn btn-primary">
          <PlusCircle size={18} /> Book New Appointment
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="stat-cards-grid mb-4">
        <div className="card stat-card">
          <div className="stat-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Calendar size={22} />
          </div>
          <div>
            <span className="stat-num">{total}</span>
            <span className="stat-title">Total Appointments</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={22} />
          </div>
          <div>
            <span className="stat-num">{upcoming.length}</span>
            <span className="stat-title">Upcoming</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrap" style={{ background: '#d1fae5', color: '#059669' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="stat-num">{completed}</span>
            <span className="stat-title">Completed</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrap" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <XCircle size={22} />
          </div>
          <div>
            <span className="stat-num">{cancelled}</span>
            <span className="stat-title">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Next Appointment Prominent Banner */}
      <div className="card next-appt-card mb-4">
        <div className="card-header-flex">
          <h3>Next Upcoming Appointment</h3>
          {nextAppointment && <StatusBadge status={nextAppointment.status} />}
        </div>

        {nextAppointment ? (
          <div className="next-appt-body">
            <div className="next-doc-info">
              <img
                src={nextAppointment.doctor?.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80'}
                alt={nextAppointment.doctor?.name}
                className="next-doc-img"
              />
              <div>
                <h4 style={{ fontSize: '1.2rem' }}>{nextAppointment.doctor?.name}</h4>
                <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{nextAppointment.doctor?.specialization}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{nextAppointment.department?.name}</p>
              </div>
            </div>

            <div className="next-time-box">
              <div className="time-item">
                <Calendar size={18} className="time-icon" />
                <span>Date: <strong>{nextAppointment.appointmentDate}</strong></span>
              </div>
              <div className="time-item">
                <Clock size={18} className="time-icon" />
                <span>Slot: <strong>{nextAppointment.appointmentTime}</strong></span>
              </div>
            </div>

            <div className="next-appt-actions">
              <button
                onClick={() => setCancelModal({ open: true, apptId: nextAppointment._id })}
                className="btn btn-danger btn-sm"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No upcoming active appointments scheduled.</p>
            <Link to="/patient/book" className="btn btn-secondary btn-sm">
              Schedule an Appointment Now
            </Link>
          </div>
        )}
      </div>

      {/* Quick Action Footer */}
      <div className="dashboard-quick-footer">
        <Link to="/patient/appointments" className="btn btn-secondary flex-1">
          <Clock size={18} /> View All Upcoming ({upcoming.length})
        </Link>
        <Link to="/patient/history" className="btn btn-secondary flex-1">
          <History size={18} /> View Full History
        </Link>
      </div>

      {/* Cancel Modal */}
      <ConfirmDialog
        isOpen={cancelModal.open}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this appointment? The doctor time slot will become available for other patients."
        confirmText="Yes, Cancel Appointment"
        loading={cancelling}
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelModal({ open: false, apptId: null })}
      />

      <style>{`
        .mb-4 { margin-bottom: 1.75rem; }
        .p-4 { padding: 1.5rem !important; }
        .welcome-banner {
          padding: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%);
          border-left: 5px solid var(--primary);
        }
        .stat-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .stat-card {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .stat-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-num {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--dark);
          line-height: 1.1;
          display: block;
        }
        .stat-title {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .next-appt-card { padding: 1.5rem; }
        .card-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1.25rem;
        }
        .next-appt-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .next-doc-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .next-doc-img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
        }
        .next-time-box {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          background: var(--bg-light);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
        }
        .time-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .time-icon { color: var(--primary); }
        .dashboard-quick-footer {
          display: flex;
          gap: 1rem;
        }
        .flex-1 { flex: 1; justify-content: center; }
        @media (max-width: 992px) {
          .stat-cards-grid { grid-template-columns: repeat(2, 1fr); }
          .welcome-banner { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 600px) {
          .stat-cards-grid { grid-template-columns: 1fr; }
          .next-appt-body { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
};

export default PatientDashboard;
