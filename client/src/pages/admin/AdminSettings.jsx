import React from 'react';
import hospitalConfig from '../../utils/hospitalConfig';
import { Settings, Database, Server, ShieldAlert, CheckCircle2 } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="admin-settings-page animate-fade-in">
      <div className="mb-4">
        <h2>Hospital & System Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Central hospital metadata and local MongoDB system configuration
        </p>
      </div>

      <div className="card p-4 mb-4">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Database size={20} className="icon-blue" /> MongoDB Local Database Connection
        </h3>

        <div className="settings-info-grid">
          <div className="info-box">
            <span className="box-lbl">Database Target:</span>
            <span className="box-val">MongoDB Community Server (Local)</span>
          </div>

          <div className="info-box">
            <span className="box-lbl">Connection URI:</span>
            <span className="box-val code-font">mongodb://127.0.0.1:27017/hospital_management</span>
          </div>

          <div className="info-box">
            <span className="box-lbl">Compass Database Name:</span>
            <span className="box-val">hospital_management</span>
          </div>

          <div className="info-box">
            <span className="box-lbl">Collections:</span>
            <span className="box-val">users, doctors, departments, appointments</span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Server size={20} className="icon-blue" /> Hospital Profile Metadata
        </h3>

        <div className="settings-info-grid">
          <div className="info-box">
            <span className="box-lbl">Hospital Name:</span>
            <span className="box-val">{hospitalConfig.name}</span>
          </div>
          <div className="info-box">
            <span className="box-lbl">Emergency Phone:</span>
            <span className="box-val">{hospitalConfig.emergencyPhone}</span>
          </div>
          <div className="info-box">
            <span className="box-lbl">Hospital Email:</span>
            <span className="box-val">{hospitalConfig.email}</span>
          </div>
          <div className="info-box">
            <span className="box-lbl">Full Address:</span>
            <span className="box-val">{hospitalConfig.fullAddress}</span>
          </div>
        </div>
      </div>

      <style>{`
        .mb-4 { margin-bottom: 1.75rem; }
        .p-4 { padding: 1.5rem !important; }
        .icon-blue { color: var(--primary); }
        .settings-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .info-box {
          background-color: var(--bg-light);
          padding: 1rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .box-lbl { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }
        .box-val { font-size: 0.95rem; font-weight: 700; color: var(--dark); }
        .code-font { font-family: monospace; color: var(--primary); }
        @media (max-width: 600px) { .settings-info-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default AdminSettings;
