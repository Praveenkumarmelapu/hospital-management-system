import React from 'react';
import images from '../../assets/images/images';
import hospitalConfig from '../../utils/hospitalConfig';
import { Award, ShieldCheck, HeartPulse, Users, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Header Banner */}
      <section
        className="bg-overlay-section"
        style={{ backgroundImage: `url(${images.about})`, padding: '4rem 1.5rem' }}
      >
        <div className="section-overlay" style={{ padding: '2rem' }}>
          <div className="container text-center">
            <h1 style={{ color: '#ffffff', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              About {hospitalConfig.name}
            </h1>
            <p style={{ color: '#e0f2fe', fontSize: '1.1rem' }}>
              Leading the way in medical excellence, patient safety, and healthcare innovation.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container">
          <div className="about-content-grid">
            <div>
              <span className="sub-tag">Our Healthcare Story</span>
              <h2>Two Decades of Dedicated Medical Service</h2>
              <p className="lead-text" style={{ marginTop: '1rem' }}>
                Established in 2004, CarePlus Multispeciality Hospital has grown into one of the region's most trusted tertiary healthcare institutions.
              </p>
              <p className="desc-text">
                Our campus features over 250 beds, state-of-the-art modular operating theatres, an advanced 30-bed intensive care unit (ICU), and a 24/7 level-1 emergency trauma centre.
              </p>

              <div className="stats-row" style={{ marginTop: '2rem' }}>
                {hospitalConfig.stats.map((st, i) => (
                  <div key={i} className="stat-card">
                    <span className="stat-value">{st.value}</span>
                    <span className="stat-label">{st.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <img
                src={images.hero}
                alt="Hospital Facility"
                style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .section-padding { padding: 4.5rem 0; }
        .bg-white { background-color: #ffffff; }
        .sub-tag {
          color: var(--primary);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .text-center { text-align: center; }
        .lead-text { font-size: 1.1rem; font-weight: 600; color: var(--dark); }
        .desc-text { color: var(--text-muted); line-height: 1.6; margin-top: 0.75rem; }
        
        .about-content-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          align-items: center;
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .stat-card {
          background: var(--bg-light);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          border-left: 4px solid var(--primary);
        }
        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary);
          display: block;
        }
        .stat-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        @media (max-width: 992px) {
          .about-content-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
