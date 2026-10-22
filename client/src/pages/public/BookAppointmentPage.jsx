import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  LogIn,
  Info,
} from 'lucide-react';

const BookAppointmentPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedDoctor = searchParams.get('doctor') || '';

  // Form State
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoctor);
  const [appointmentDate, setAppointmentDate] = useState(() => {
    // Tomorrow's date default
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');

  // Dynamic slot state
  const [slotsData, setSlotsData] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Fetch departments & doctors list
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [deptsRes, docsRes] = await Promise.all([
          api.get('/departments'),
          api.get('/doctors'),
        ]);
        setDepartments(deptsRes.data);
        setDoctors(docsRes.data);

        // If preselected doctor parameter exists
        if (preselectedDoctor) {
          const doc = docsRes.data.find((d) => d._id === preselectedDoctor);
          if (doc) {
            setSelectedDoctor(doc._id);
            if (doc.department) {
              setSelectedDepartment(doc.department._id || doc.department);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching initial booking data:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchInitialData();
  }, [preselectedDoctor]);

  // Fetch available slots when Doctor or Date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctor || !appointmentDate) {
        setSlotsData(null);
        return;
      }
      setSlotsLoading(true);
      setError('');
      try {
        const res = await api.get(
          `/appointments/available-slots?doctorId=${selectedDoctor}&date=${appointmentDate}`
        );
        setSlotsData(res.data);
        setSelectedSlot('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch doctor slots for this date.');
        setSlotsData(null);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDoctor, appointmentDate]);

  // Filter doctors by selected department
  const filteredDoctors = selectedDepartment
    ? doctors.filter((doc) => {
        const deptId = typeof doc.department === 'object' ? doc.department._id : doc.department;
        return deptId === selectedDepartment;
      })
    : doctors;

  const currentDoctorObj = doctors.find((d) => d._id === selectedDoctor);
  const currentDeptObj = departments.find((d) => d._id === selectedDepartment);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentDate || !selectedSlot || !reason) {
      setError('Please select Doctor, Date, Available Time Slot, and Reason for visit.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/appointments', {
        doctorId: selectedDoctor,
        departmentId: currentDoctorObj?.department?._id || selectedDepartment,
        appointmentDate,
        appointmentTime: selectedSlot,
        reason,
      });

      setSuccessMsg('Appointment booked successfully!');
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="card text-center p-5" style={{ maxWidth: '540px', margin: '0 auto' }}>
          <Info size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} />
          <h2 style={{ marginBottom: '0.75rem' }}>Login Required to Book</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
            Please log in to your patient account to select doctor consultation time slots and complete booking.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary btn-lg">
              <LogIn size={18} /> Login to Patient Account
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Register New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loadingInitial) return <LoadingSpinner fullScreen text="Preparing booking engine..." />;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-page bg-light" style={{ padding: '3rem 0', minHeight: '85vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="section-title">Schedule a Doctor Appointment</h1>
          <p className="section-subtitle">
            Choose your preferred clinical department, doctor, consultation date, and available time slot.
          </p>
        </div>

        {successMsg && (
          <div className="alert-success-banner mb-4">
            <CheckCircle2 size={22} />
            <span>{successMsg} Redirecting to your dashboard...</span>
          </div>
        )}

        {error && (
          <div className="alert-error mb-4">
            <AlertCircle size={22} />
            <span>{error}</span>
          </div>
        )}

        <div className="booking-grid">
          {/* Booking Form */}
          <div className="card p-4">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Department Selection */}
              <div className="form-group">
                <label><Building2 size={16} /> 1. Select Department</label>
                <select
                  className="form-control"
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedDoctor('');
                  }}
                >
                  <option value="">-- All Clinical Departments --</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Doctor Selection */}
              <div className="form-group">
                <label><Stethoscope size={16} /> 2. Select Doctor *</label>
                <select
                  className="form-control"
                  required
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">-- Choose Specialist Doctor --</option>
                  {filteredDoctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name} - {doc.specialization} (Fee: ₹{doc.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Date Selection */}
              <div className="form-group">
                <label><Calendar size={16} /> 3. Consultation Date *</label>
                <input
                  type="date"
                  className="form-control"
                  min={todayStr}
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>

              {/* Step 4: Available Slots */}
              <div className="form-group">
                <label><Clock size={16} /> 4. Select Available Time Slot *</label>
                {slotsLoading ? (
                  <LoadingSpinner text="Checking slot availability..." />
                ) : !selectedDoctor ? (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Please select a doctor to view working schedule & time slots.
                  </p>
                ) : slotsData && !slotsData.available ? (
                  <div className="slot-unavailable-alert">
                    {slotsData.message || 'Doctor is not available on this date.'}
                  </div>
                ) : slotsData && slotsData.slots ? (
                  <div className="slots-grid">
                    {slotsData.slots.map((slot, index) => (
                      <button
                        type="button"
                        key={index}
                        disabled={slot.isBooked}
                        className={`slot-pill ${selectedSlot === slot.time ? 'selected' : ''} ${
                          slot.isBooked ? 'booked' : ''
                        }`}
                        onClick={() => setSelectedSlot(slot.time)}
                      >
                        {slot.time}
                        {slot.isBooked && <span className="booked-lbl">Booked</span>}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Step 5: Reason for Visit */}
              <div className="form-group">
                <label>5. Reason for Visit / Symptoms *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  placeholder="Describe your health symptoms or consultation reason (e.g. Regular heart checkup, fever, skin rash...)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !selectedSlot}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                <CheckCircle2 size={20} /> {submitting ? 'Booking Slot...' : 'Confirm Appointment'}
              </button>
            </form>
          </div>

          {/* Appointment Summary Box */}
          <div className="card p-4 summary-card">
            <h3>Appointment Summary</h3>
            <div className="divider mb-3" />

            <div className="summary-section">
              <span className="sum-label">Patient Name:</span>
              <span className="sum-val">{currentUser?.name}</span>
            </div>

            <div className="summary-section">
              <span className="sum-label">Doctor:</span>
              <span className="sum-val">{currentDoctorObj ? currentDoctorObj.name : 'Not Selected'}</span>
            </div>

            <div className="summary-section">
              <span className="sum-label">Specialization:</span>
              <span className="sum-val">{currentDoctorObj ? currentDoctorObj.specialization : '-'}</span>
            </div>

            <div className="summary-section">
              <span className="sum-label">Department:</span>
              <span className="sum-val">
                {currentDoctorObj?.department?.name || currentDeptObj?.name || '-'}
              </span>
            </div>

            <div className="summary-section">
              <span className="sum-label">Consultation Date:</span>
              <span className="sum-val">{appointmentDate || 'Not Selected'}</span>
            </div>

            <div className="summary-section">
              <span className="sum-label">Time Slot:</span>
              <span className="sum-val highlight-slot">{selectedSlot || 'Not Selected'}</span>
            </div>

            <div className="summary-section">
              <span className="sum-label">Consultation Fee:</span>
              <span className="sum-val fee-val">
                {currentDoctorObj ? `₹${currentDoctorObj.consultationFee}` : '-'}
              </span>
            </div>

            {reason && (
              <div className="summary-reason">
                <span className="sum-label">Reason:</span>
                <p className="reason-text">{reason}</p>
              </div>
            )}

            <div className="viva-note mt-4">
              <Info size={16} />
              <span>
                Double-booking prevention is strictly enforced by MongoDB backend server validation.
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .p-4 { padding: 2rem !important; }
        .mb-3 { margin-bottom: 1rem; }
        .mb-4 { margin-bottom: 1.5rem; }
        .mt-4 { margin-top: 1.5rem; }
        .booking-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 2.5rem;
        }
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
          margin-top: 0.5rem;
        }
        .slot-pill {
          padding: 0.6rem 0.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background: #ffffff;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--dark);
          position: relative;
        }
        .slot-pill:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
        }
        .slot-pill.selected {
          background-color: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
        }
        .slot-pill.booked {
          background-color: #fee2e2;
          color: #991b1b;
          border-color: #fca5a5;
          cursor: not-allowed;
          opacity: 0.65;
        }
        .booked-lbl {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 700;
        }
        .slot-unavailable-alert {
          padding: 0.85rem 1rem;
          background-color: #fef3c7;
          color: #92400e;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
        }
        .alert-success-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: #d1fae5;
          color: #047857;
          border: 1px solid #6ee7b7;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        .alert-error {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fca5a5;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        .summary-card {
          background: #ffffff;
          align-self: flex-start;
        }
        .divider {
          height: 1px;
          background-color: var(--border-color);
        }
        .summary-section {
          display: flex;
          justify-content: space-between;
          padding: 0.6rem 0;
          border-bottom: 1px dashed #e2e8f0;
          font-size: 0.9rem;
        }
        .sum-label { color: var(--text-muted); font-weight: 500; }
        .sum-val { font-weight: 700; color: var(--dark); }
        .highlight-slot { color: var(--primary); }
        .fee-val { color: var(--success); font-size: 1.05rem; }
        .summary-reason { margin-top: 1rem; }
        .reason-text { font-size: 0.85rem; color: var(--text-main); font-style: italic; margin-top: 0.25rem; }
        .viva-note {
          display: flex;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          background-color: var(--bg-light);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
        }
        @media (max-width: 992px) {
          .booking-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default BookAppointmentPage;
