import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Calendar, Clock, PlusCircle, AlertCircle, XCircle } from 'lucide-react';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ open: false, apptId: null });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const fetchUpcoming = async () => {
    try {
      const res = await api.get('/appointments/my?type=upcoming');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching upcoming appointments:', err);
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
      fetchUpcoming();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching upcoming appointments..." />;

  return (
    <div className="upcoming-appointments-page animate-fade-in">
      <div className="page-header-flex mb-4">
        <div>
          <h2>Upcoming Appointments</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            View active consultation schedules and manage cancellations
          </p>
        </div>
        <Link to="/patient/book" className="btn btn-primary btn-sm">
          <PlusCircle size={16} /> Book New
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="card text-center p-5">
          <Calendar size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
          <h3>No Upcoming Appointments</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            You do not have any pending or confirmed upcoming consultations scheduled.
          </p>
          <Link to="/patient/book" className="btn btn-primary">
            Book an Appointment
          </Link>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appt) => (
            <div key={appt._id} className="card appt-card mb-3">
              <div className="appt-card-grid">
                <div className="appt-doc-box">
                  <img
                    src={appt.doctor?.profileImage || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80'}
                    alt={appt.doctor?.name}
                    className="doc-avatar"
                  />
                  <div>
                    <h4 style={{ fontSize: '1.15rem' }}>{appt.doctor?.name}</h4>
                    <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {appt.doctor?.specialization}
                    </p>
                    <span className="dept-pill">{appt.department?.name}</span>
                  </div>
                </div>

                <div className="appt-time-details">
                  <div className="meta-row">
                    <Calendar size={16} className="icon-blue" />
                    <span>Date: <strong>{appt.appointmentDate}</strong></span>
                  </div>
                  <div className="meta-row">
                    <Clock size={16} className="icon-blue" />
                    <span>Time Slot: <strong>{appt.appointmentTime}</strong></span>
                  </div>
                  <div className="meta-row reason-row">
                    <span>Reason: <em>{appt.reason}</em></span>
                  </div>
                </div>

                <div className="appt-status-action">
                  <StatusBadge status={appt.status} />
                  {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                    <button
                      onClick={() => setCancelModal({ open: true, apptId: appt._id })}
                      className="btn btn-danger btn-sm"
                      style={{ marginTop: '0.75rem' }}
                    >
                      <XCircle size={15} /> Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={cancelModal.open}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this appointment? The doctor time slot will immediately become available again."
        confirmText="Yes, Cancel Appointment"
        loading={cancelling}
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelModal({ open: false, apptId: null })}
      />

      <style>{`
        .mb-3 { margin-bottom: 1.25rem; }
        .mb-4 { margin-bottom: 1.75rem; }
        .p-5 { padding: 3.5rem !important; }
        .page-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .appt-card { padding: 1.5rem; }
        .appt-card-grid {
          display: grid;
          grid-template-columns: 1.5fr 1.5fr 1fr;
          gap: 1.5rem;
          align-items: center;
        }
        .appt-doc-box {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .doc-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary-light);
        }
        .dept-pill {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
          margin-top: 0.2rem;
        }
        .meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          margin-bottom: 0.35rem;
        }
        .icon-blue { color: var(--primary); }
        .reason-row { font-size: 0.85rem; color: var(--text-muted); }
        .appt-status-action {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        @media (max-width: 992px) {
          .appt-card-grid { grid-template-columns: 1fr; }
          .appt-status-action { align-items: flex-start; margin-top: 0.5rem; }
        }
      `}</style>
    </div>
  );
};

export default PatientAppointments;
