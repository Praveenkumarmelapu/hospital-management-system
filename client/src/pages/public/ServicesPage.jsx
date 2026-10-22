import React from 'react';
import hospitalConfig from '../../utils/hospitalConfig';
import images from '../../assets/images/images';
import { Activity, ShieldCheck, HeartPulse, Scan, FlaskConical, Pill, Ambulance, Stethoscope } from 'lucide-react';

const ServicesPage = () => {
  return (
    <div className="services-page">
      <section
        className="bg-overlay-section"
        style={{ backgroundImage: `url(${images.services})`, padding: '4rem 1.5rem' }}
      >
        <div className="section-overlay" style={{ padding: '2rem' }}>
          <div className="container text-center">
            <h1 style={{ color: '#ffffff', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              Our Healthcare & Medical Services
            </h1>
            <p style={{ color: '#e0f2fe', fontSize: '1.1rem' }}>
              Complete diagnostic, therapeutic, emergency, and surgical clinical services.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="grid-3">
            {hospitalConfig.services.map((srv) => (
              <div key={srv.id} className="card service-card">
                <div className="service-icon-wrap">
                  <Activity size={24} />
                </div>
                <h3>{srv.title}</h3>
                <p>{srv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .section-padding { padding: 4.5rem 0; }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .service-card { padding: 2rem; }
        .service-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        @media (max-width: 992px) { .grid-3 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .grid-3 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default ServicesPage;
