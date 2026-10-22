import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope } from 'lucide-react';

const DepartmentCard = ({ department }) => {
  const { _id, name, description, image } = department;
  const defaultImg = 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="card dept-card animate-fade-in">
      <div className="dept-img-wrap">
        <img
          src={image || defaultImg}
          alt={name}
          className="dept-img"
          onError={(e) => { e.target.src = defaultImg; }}
        />
        <div className="dept-overlay" />
        <div className="dept-title-box">
          <Stethoscope size={20} className="dept-icon" />
          <h3>{name}</h3>
        </div>
      </div>

      <div className="dept-body">
        <p className="dept-desc">{description}</p>
        <Link to={`/doctors?department=${encodeURIComponent(name)}`} className="btn btn-secondary btn-sm dept-btn">
          View Doctors <ArrowRight size={15} />
        </Link>
      </div>

      <style>{`
        .dept-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .dept-img-wrap {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        .dept-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .dept-card:hover .dept-img {
          transform: scale(1.06);
        }
        .dept-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 80%);
        }
        .dept-title-box {
          position: absolute;
          bottom: 12px;
          left: 16px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffffff;
        }
        .dept-title-box h3 {
          color: #ffffff;
          font-size: 1.2rem;
          font-weight: 700;
        }
        .dept-icon {
          color: #38bdf8;
        }
        .dept-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .dept-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          flex-grow: 1;
        }
        .dept-btn {
          align-self: flex-start;
          width: 100%;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
};

export default DepartmentCard;
