import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const PatientLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ flexGrow: 1, padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <Sidebar role="patient" />
          <main style={{ flex: 1, minWidth: '300px' }}>
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientLayout;
