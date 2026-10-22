import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { Award, DollarSign, Calendar, Clock, Phone, Mail, Stethoscope, ArrowLeft } from 'lucide-react';

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        setError('Failed to load doctor profile. Doctor may not exist or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen text="Loading doctor profile..." />;

  if (error || !doctor) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>{error || 'Doctor not found'}</h2>
        <Link to="/doctors" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Doctors
        </Link>
      </div>
    );
  }

  const defaultImg = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80';

  return (
    <div className="doctor-detail-page bg-light" style={{ padding: '3rem 0' }}>
      <div className="container">
        <Link to="/doctors" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Doctors List
        </Link>

        <div className="card detail-card">
          <div className="detail-grid">
            {/* Left Photo */}
            <div className="detail-photo-wrap">
              <img
                src={doctor.profileImage || defaultImg}
                alt={doctor.name}
                className="detail-photo"
                onError={(e) => { e.target.src = defaultImg; }}
              />
              <div style={{ marginTop: '1rem', textTransform: 'center' }}>
                <StatusBadge status={doctor.status} />
              </div>
            </div>

            {/* Right Bio & Schedule */}
            <div className="detail-content">
              <span className="dept-tag">{doctor.department?.name || 'Medical Department'}</span>
              <h1 className="doctor-detail-name">{doctor.name}</h1>
              <p className="spec-text">{doctor.specialization}</p>

              <div className="meta-pills">
                <div className="pill">
                  <Stethoscope size={16} className="pill-icon" />
                  <span>{doctor.qualification}</span>
                </div>
                <div className="pill">
                  <Award size={16} className="pill-icon" />
                  <span>{doctor.experience} Years Experience</span>
                </div>
                <div className="pill">
                  <DollarSign size={16} className="pill-icon" />
                  <span>Fee: ₹{doctor.consultationFee}</span>
                </div>
              </div>

              {/* About */}
              <div className="detail-section">
                <h3>About Dr. {doctor.name.split(' ').pop()}</h3>
                <p style={{ color: 'var(--text-main)', lineHeight: '1.7' }}>
                  {doctor.about || 'Dedicated healthcare expert committed to comprehensive medical diagnosis and patient-centered treatment.'}
                </p>
              </div>

              {/* Working Hours Schedule */}
              <div className="detail-section">
                <h3>Working Days & Schedule</h3>
                <div className="schedule-table-wrap">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Status</th>
                        <th>Consultation Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctor.availability && doctor.availability.length > 0 ? (
                        doctor.availability.map((sch, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 600 }}>{sch.day}</td>
                            <td>
                              {sch.isAvailable ? (
                                <span style={{ color: 'var(--success)', fontWeight: 600 }}>Available</span>
                              ) : (
                                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>OFF</span>
                              )}
                            </td>
                            <td>{sch.isAvailable ? `${sch.startTime} - ${sch.endTime}` : 'No Consultation'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3">Schedule unavailable</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CTA */}
              <div style={{ marginTop: '2rem' }}>
                <Link
                  to={`/book-appointment?doctor=${doctor._id}`}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <Calendar size={20} /> Book Appointment with {doctor.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .detail-card { padding: 2.5rem; }
        .detail-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 3rem;
        }
        .detail-photo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .detail-photo {
          width: 100%;
          height: 380px;
          object-fit: cover;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }
        .doctor-detail-name {
          font-size: 2.2rem;
          margin-bottom: 0.2rem;
        }
        .spec-text {
          font-size: 1.1rem;
          color: var(--primary);
          font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .meta-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-light);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--dark);
          border: 1px solid var(--border-color);
        }
        .pill-icon { color: var(--primary); }
        .detail-section {
          margin-bottom: 1.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-color);
        }
        .detail-section h3 {
          font-size: 1.2rem;
          margin-bottom: 0.85rem;
        }
        .schedule-table-wrap {
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }
        @media (max-width: 992px) {
          .detail-grid { grid-template-columns: 1fr; }
          .detail-photo { height: 300px; }
        }
      `}</style>
    </div>
  );
};

export default DoctorDetail;
