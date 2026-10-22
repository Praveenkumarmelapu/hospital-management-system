import React, { useState } from 'react';
import images from '../../assets/images/images';
import hospitalConfig from '../../utils/hospitalConfig';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <section
        className="bg-overlay-section"
        style={{ backgroundImage: `url(${images.contact})`, padding: '4rem 1.5rem' }}
      >
        <div className="section-overlay" style={{ padding: '2rem' }}>
          <div className="container text-center">
            <h1 style={{ color: '#ffffff', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              Contact {hospitalConfig.name}
            </h1>
            <p style={{ color: '#e0f2fe', fontSize: '1.1rem' }}>
              We are here to assist you 24 hours a day, 7 days a week.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Details Card */}
            <div className="card p-4">
              <h2 style={{ marginBottom: '1.5rem' }}>Get in Touch</h2>

              <div className="contact-info-block">
                <div className="info-icon"><MapPin size={22} /></div>
                <div>
                  <h4>Hospital Address</h4>
                  <p>{hospitalConfig.fullAddress}</p>
                </div>
              </div>

              <div className="contact-info-block">
                <div className="info-icon"><Phone size={22} /></div>
                <div>
                  <h4>General Inquiries</h4>
                  <p>{hospitalConfig.phone}</p>
                </div>
              </div>

              <div className="contact-info-block">
                <div className="info-icon" style={{ background: '#fee2e2', color: '#dc2626' }}><Phone size={22} /></div>
                <div>
                  <h4>Emergency Helpline (24/7)</h4>
                  <p style={{ color: '#dc2626', fontWeight: 700 }}>{hospitalConfig.emergencyPhone}</p>
                </div>
              </div>

              <div className="contact-info-block">
                <div className="info-icon"><Mail size={22} /></div>
                <div>
                  <h4>Email Address</h4>
                  <p>{hospitalConfig.email}</p>
                </div>
              </div>

              <div className="contact-info-block">
                <div className="info-icon"><Clock size={22} /></div>
                <div>
                  <h4>OPD Working Hours</h4>
                  <p>{hospitalConfig.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card p-4">
              <h2 style={{ marginBottom: '1.5rem' }}>Send Us a Message</h2>

              {submitted ? (
                <div className="alert-success-box">
                  <CheckCircle2 size={32} style={{ color: 'var(--success)', marginBottom: '0.5rem' }} />
                  <h3>Thank you for reaching out!</h3>
                  <p>Your message has been received. Our hospital desk will respond to your email shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. General Inquiry / Feedback"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    <Send size={18} /> Submit Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .section-padding { padding: 4.5rem 0; }
        .p-4 { padding: 2rem !important; }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2.5rem;
        }
        .contact-info-block {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .info-icon {
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
        .contact-info-block h4 {
          font-size: 1rem;
          margin-bottom: 0.2rem;
        }
        .contact-info-block p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .alert-success-box {
          text-align: center;
          padding: 3rem 1.5rem;
        }
        @media (max-width: 992px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
