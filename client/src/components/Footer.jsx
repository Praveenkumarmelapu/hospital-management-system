import React from 'react';
import { Link } from 'react-router-dom';
import hospitalConfig from '../utils/hospitalConfig';
import { Cross, MapPin, Phone, Mail, Clock, Heart, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: About */}
          <div className="footer-col">
            <div className="footer-logo">
              <div className="logo-icon-bg">
                <Cross size={20} />
              </div>
              <span className="footer-brand">{hospitalConfig.name}</span>
            </div>
            <p className="footer-desc">
              Providing world-class medical care with compassionate healthcare professionals, cutting-edge diagnostic technology, and patient-centered service.
            </p>
            <div className="emergency-badge">
              <Phone size={16} />
              <span>Emergency 24/7: <strong>+91 9347140213</strong></span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/doctors">Our Doctors</Link></li>
              <li><Link to="/departments">Departments</Link></li>
              <li><Link to="/services">Medical Services</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/book-appointment">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Col 3: Departments */}
          <div className="footer-col">
            <h4 className="footer-title">Specialities</h4>
            <ul className="footer-links">
              <li><Link to="/doctors?department=Cardiology">Cardiology</Link></li>
              <li><Link to="/doctors?department=Neurology">Neurology</Link></li>
              <li><Link to="/doctors?department=Orthopedics">Orthopedics</Link></li>
              <li><Link to="/doctors?department=Pediatrics">Pediatrics</Link></li>
              <li><Link to="/doctors?department=Dermatology">Dermatology</Link></li>
              <li><Link to="/doctors?department=General%20Medicine">General Medicine</Link></li>
              <li><Link to="/doctors?department=Gynecology">Gynecology</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="footer-col">
            <h4 className="footer-title">Hospital Location</h4>
            <div className="contact-item">
              <MapPin size={18} className="contact-icon" />
              <span>{hospitalConfig.fullAddress}</span>
            </div>
            <div className="contact-item">
              <Phone size={18} className="contact-icon" />
              <span>{hospitalConfig.phone}</span>
            </div>
            <div className="contact-item">
              <Mail size={18} className="contact-icon" />
              <span>{hospitalConfig.email}</span>
            </div>
            <div className="contact-item">
              <Clock size={18} className="contact-icon" />
              <span>{hospitalConfig.workingHours}</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {hospitalConfig.name}. All Rights Reserved. Built for Academic Demonstration.</p>
          <div className="academic-tag">
            <ShieldCheck size={15} />
            <span>MERN Stack Academic Project</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: var(--dark-surface);
          color: #94a3b8;
          padding-top: 4rem;
          padding-bottom: 2rem;
          margin-top: 4rem;
          border-top: 1px solid #334155;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.25fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .footer-brand {
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
        }
        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
        .emergency-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(2, 132, 199, 0.15);
          border: 1px solid var(--primary);
          color: #38bdf8;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
        }
        .footer-title {
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          position: relative;
          padding-bottom: 0.5rem;
        }
        .footer-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 35px;
          height: 3px;
          background-color: var(--primary);
          border-radius: 2px;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .footer-links a {
          font-size: 0.9rem;
          transition: var(--transition);
        }
        .footer-links a:hover {
          color: #38bdf8;
          padding-left: 4px;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9rem;
          margin-bottom: 0.85rem;
        }
        .contact-icon {
          color: var(--primary);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.75rem;
          border-top: 1px solid #334155;
          font-size: 0.85rem;
        }
        .academic-tag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #38bdf8;
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 0.75rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
