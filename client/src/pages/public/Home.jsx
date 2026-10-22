import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import images from '../../assets/images/images';
import hospitalConfig from '../../utils/hospitalConfig';
import DoctorCard from '../../components/DoctorCard';
import DepartmentCard from '../../components/DepartmentCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Calendar,
  Users,
  Award,
  Clock,
  ShieldCheck,
  Activity,
  HeartPulse,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Mail,
  FlaskConical,
  Scan,
  Pill,
  Shield,
  HeartHandshake,
  Stethoscope,
} from 'lucide-react';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, deptsRes] = await Promise.all([
          api.get('/doctors'),
          api.get('/departments'),
        ]);
        setDoctors(docsRes.data.slice(0, 4)); // Show featured top 4
        setDepartments(deptsRes.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* 1. Hero Section with Background Image & Dark Overlay */}
      <section
        className="bg-overlay-section hero-section"
        style={{ backgroundImage: `url(${images.hero})` }}
      >
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content animate-fade-in">
              <div className="hero-badge">
                <ShieldCheck size={16} /> 24/7 Premium Multispeciality Hospital
              </div>
              <h1 className="hero-title">{hospitalConfig.tagline}</h1>
              <p className="hero-subheading">{hospitalConfig.subheading}</p>
              <div className="hero-buttons">
                <Link to="/book-appointment" className="btn btn-primary btn-lg">
                  <Calendar size={18} /> Book an Appointment
                </Link>
                <Link to="/doctors" className="btn btn-outline-white btn-lg">
                  <Users size={18} /> Meet Our Doctors
                </Link>
              </div>

              {/* Quick Stat Pill */}
              <div className="hero-stats-banner">
                {hospitalConfig.stats.map((stat, idx) => (
                  <div key={idx} className="hero-stat-box">
                    <span className="hero-stat-val">{stat.value}</span>
                    <span className="hero-stat-lbl">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrap">
              <img src={images.about} alt="CarePlus Hospital Building" className="about-img" />
              <div className="experience-badge">
                <span className="exp-num">20+</span>
                <span className="exp-text">Years of Medical Excellence</span>
              </div>
            </div>

            <div className="about-text-content">
              <span className="sub-tag">About CarePlus</span>
              <h2>Pioneering Advanced Healthcare & Patient Care</h2>
              <p className="lead-text">
                CarePlus Multispeciality Hospital is committed to delivering state-of-the-art medical services with human warmth and clinical precision.
              </p>
              <p className="desc-text">
                Our hospital combines experienced specialist physicians, compassionate nursing staff, and modern surgical suites to provide full-spectrum medical treatment across 20+ specialized clinical departments.
              </p>

              <div className="about-features">
                <div className="feat-item">
                  <CheckCircle2 size={20} className="feat-icon" />
                  <span>Experienced Specialist Physicians</span>
                </div>
                <div className="feat-item">
                  <CheckCircle2 size={20} className="feat-icon" />
                  <span>Modern Diagnostic & ICU Facilities</span>
                </div>
                <div className="feat-item">
                  <CheckCircle2 size={20} className="feat-icon" />
                  <span>24/7 Trauma & Emergency Support</span>
                </div>
                <div className="feat-item">
                  <CheckCircle2 size={20} className="feat-icon" />
                  <span>Patient-Centered Personal Care</span>
                </div>
              </div>

              <Link to="/about" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Learn More About Us <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Departments Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <span className="sub-tag text-center">Clinical Specialities</span>
          <h2 className="section-title">Explore Our Departments</h2>
          <p className="section-subtitle">
            Comprehensive medical care across multiple specialized fields led by senior consultants.
          </p>

          {loading ? (
            <LoadingSpinner text="Loading departments..." />
          ) : (
            <div className="grid-4">
              {departments.map((dept) => (
                <DepartmentCard key={dept._id} department={dept} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/departments" className="btn btn-secondary">
              View All Departments <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Doctors Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <span className="sub-tag text-center">Medical Experts</span>
          <h2 className="section-title">Meet Our Senior Doctors</h2>
          <p className="section-subtitle">
            Highly qualified doctors dedicated to your health and well-being.
          </p>

          {loading ? (
            <LoadingSpinner text="Loading doctors..." />
          ) : (
            <div className="grid-4">
              {doctors.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/doctors" className="btn btn-primary">
              View All Doctors & Book <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Services Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <span className="sub-tag text-center">Healthcare Services</span>
          <h2 className="section-title">Our Medical Services</h2>
          <p className="section-subtitle">
            World-class diagnostic, therapeutic, and surgical services for complete recovery.
          </p>

          <div className="grid-3">
            {hospitalConfig.services.map((srv) => (
              <div key={srv.id} className="card service-card">
                <div className="service-icon-wrap">
                  <Activity size={24} className="service-icon" />
                </div>
                <h3>{srv.title}</h3>
                <p>{srv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="why-us-grid">
            <div className="why-us-text">
              <span className="sub-tag">Why Choose CarePlus</span>
              <h2>Your Health is Our Top Priority</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                We combine clinical excellence with seamless technology to deliver the best healthcare experience for you and your family.
              </p>

              <div className="why-us-list">
                <div className="why-item">
                  <div className="why-icon"><Stethoscope size={20} /></div>
                  <div>
                    <h4>Experienced Doctors</h4>
                    <p>Board-certified specialists with decades of combined clinical expertise.</p>
                  </div>
                </div>

                <div className="why-item">
                  <div className="why-icon"><HeartPulse size={20} /></div>
                  <div>
                    <h4>Modern Medical Facilities</h4>
                    <p>Advanced modular operating theatres and high-tech diagnostic suites.</p>
                  </div>
                </div>

                <div className="why-item">
                  <div className="why-icon"><HeartHandshake size={20} /></div>
                  <div>
                    <h4>Patient-Centered Care</h4>
                    <p>Personalized attention, clear communication, and empathetic treatment.</p>
                  </div>
                </div>

                <div className="why-item">
                  <div className="why-icon"><PhoneCall size={20} /></div>
                  <div>
                    <h4>24/7 Emergency Support</h4>
                    <p>Round-the-clock emergency response and quick ambulance dispatch.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="why-us-img-box">
              <img src={images.doctorTeam} alt="Medical Team" className="why-img" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Appointment CTA Banner with Background Image */}
      <section
        className="bg-overlay-section cta-section"
        style={{ backgroundImage: `url(${images.appointment})` }}
      >
        <div className="section-overlay">
          <div className="container text-center">
            <h2 style={{ color: '#ffffff', fontSize: '2.5rem', marginBottom: '1rem' }}>
              Need Doctor Consultation? Book Your Appointment Today!
            </h2>
            <p style={{ color: '#e2e8f0', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 2rem auto' }}>
              Choose your preferred department, doctor, and convenient time slot in less than 2 minutes.
            </p>
            <Link to="/book-appointment" className="btn btn-primary btn-lg">
              <Calendar size={20} /> Schedule Appointment Now
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .section-padding {
          padding: 5rem 0;
        }
        .bg-white { background-color: #ffffff; }
        .bg-light { background-color: var(--bg-light); }
        
        .sub-tag {
          display: inline-block;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }
        .text-center { text-align: center; display: block; }

        /* Hero */
        .hero-content {
          max-width: 750px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(2, 132, 199, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          padding: 0.4rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(4px);
        }
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 1rem;
        }
        .hero-subheading {
          font-size: 1.2rem;
          color: #e0f2fe;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }
        .btn-lg {
          padding: 0.9rem 1.75rem;
          font-size: 1.05rem;
        }
        .hero-stats-banner {
          display: flex;
          gap: 2rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          padding: 1.25rem 2rem;
          border-radius: var(--radius-lg);
          max-width: fit-content;
        }
        .hero-stat-box {
          display: flex;
          flex-direction: column;
        }
        .hero-stat-val {
          font-size: 1.75rem;
          font-weight: 800;
          color: #38bdf8;
        }
        .hero-stat-lbl {
          font-size: 0.8rem;
          color: #cbd5e1;
        }

        /* About */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3.5rem;
          align-items: center;
        }
        .about-image-wrap {
          position: relative;
        }
        .about-img {
          width: 100%;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }
        .experience-badge {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: #ffffff;
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .exp-num {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1;
        }
        .exp-text {
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
        }
        .lead-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 1rem;
        }
        .desc-text {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .about-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .feat-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--dark);
        }
        .feat-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        /* Grids */
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        /* Services */
        .service-card {
          padding: 1.75rem;
        }
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
        .service-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        .service-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        /* Why Choose Us */
        .why-us-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          align-items: center;
        }
        .why-us-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .why-item {
          display: flex;
          gap: 1rem;
        }
        .why-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .why-item h4 {
          font-size: 1.05rem;
          margin-bottom: 0.2rem;
        }
        .why-item p {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .why-us-img-box img {
          width: 100%;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 992px) {
          .hero-title { font-size: 2.25rem; }
          .about-grid, .why-us-grid { grid-template-columns: 1fr; }
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
          .grid-3 { grid-template-columns: repeat(2, 1fr); }
          .experience-badge { right: 10px; bottom: 10px; }
        }
        @media (max-width: 600px) {
          .grid-4, .grid-3 { grid-template-columns: 1fr; }
          .hero-stats-banner { flex-direction: column; gap: 1rem; }
          .about-features { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Home;
