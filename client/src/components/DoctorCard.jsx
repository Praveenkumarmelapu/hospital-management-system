import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const DoctorCard = ({ doctor }) => {
  const {
    _id,
    name,
    profileImage,
    specialization,
    department,
    qualification,
    experience,
    consultationFee,
    status,
  } = doctor;

  const defaultImg = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80';

  return (
    <div className="card doctor-card animate-fade-in">
      <div className="doctor-img-container">
        <img
          src={profileImage || defaultImg}
          alt={name}
          className="doctor-img"
          onError={(e) => { e.target.src = defaultImg; }}
        />
        <div className="doctor-badge-overlay">
          <StatusBadge status={status || 'active'} />
        </div>
      </div>

      <div className="doctor-card-body">
        <span className="dept-tag">{department?.name || 'General Medicine'}</span>
        <h3 className="doctor-name">{name}</h3>
        <p className="doctor-spec">{specialization}</p>
        <p className="doctor-qual">{qualification}</p>

        <div className="doctor-meta-grid">
          <div className="meta-item">
            <Award size={15} className="meta-icon" />
            <span>{experience} Yrs Exp.</span>
          </div>
          <div className="meta-item">
            <DollarSign size={15} className="meta-icon" />
            <span>₹{consultationFee} Fee</span>
          </div>
        </div>

        <div className="doctor-card-actions">
          <Link to={`/doctors/${_id}`} className="btn btn-secondary btn-sm flex-1">
            View Details
          </Link>
          <Link to={`/book-appointment?doctor=${_id}`} className="btn btn-primary btn-sm flex-1">
            <Calendar size={15} />
            Book
          </Link>
        </div>
      </div>

      <style>{`
        .doctor-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .doctor-img-container {
          position: relative;
          width: 100%;
          height: 230px;
          overflow: hidden;
          background-color: #f1f5f9;
        }
        .doctor-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          transition: transform 0.4s ease;
        }
        .doctor-card:hover .doctor-img {
          transform: scale(1.05);
        }
        .doctor-badge-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
        }
        .doctor-card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .dept-tag {
          align-self: flex-start;
          background-color: var(--primary-light);
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }
        .doctor-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 0.2rem;
        }
        .doctor-spec {
          color: var(--primary-hover);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .doctor-qual {
          color: var(--text-muted);
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }
        .doctor-meta-grid {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background-color: var(--bg-light);
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          margin-top: auto;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--dark);
        }
        .meta-icon {
          color: var(--primary);
        }
        .doctor-card-actions {
          display: flex;
          gap: 0.6rem;
        }
        .flex-1 {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default DoctorCard;
