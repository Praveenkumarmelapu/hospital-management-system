import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import hospitalConfig from '../utils/hospitalConfig';
import { Cross, Menu, X, User, Calendar, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Departments', path: '/departments' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-bg">
            <Cross size={22} className="logo-cross" />
          </div>
          <div className="logo-text">
            <span className="logo-title">CarePlus</span>
            <span className="logo-subtitle">Multispeciality Hospital</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right Action Buttons */}
        <div className="desktop-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link
                to={isAdmin ? '/admin/dashboard' : '/patient/dashboard'}
                className="btn btn-secondary btn-sm"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-white btn-sm logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                <User size={16} />
                Login
              </Link>
              <Link to="/book-appointment" className="btn btn-primary btn-sm">
                <Calendar size={16} />
                Book Appointment
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu animate-fade-in">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className="mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          <div className="mobile-actions">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/patient/dashboard'}
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-danger"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} />
                  Login
                </Link>
                <Link
                  to="/book-appointment"
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Calendar size={18} />
                  Book Appointment
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 900;
          background-color: #ffffff;
          border-bottom: 1px solid var(--border-color);
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 75px;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-icon-bg {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3);
        }
        .logo-text {
          display: flex;
          flex-direction: column;
        }
        .logo-title {
          font-weight: 800;
          font-size: 1.35rem;
          color: var(--dark);
          line-height: 1.1;
        }
        .logo-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        .nav-link {
          font-weight: 500;
          color: var(--text-main);
          font-size: 0.95rem;
          padding: 0.5rem 0;
          border-bottom: 2px solid transparent;
          transition: var(--transition);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .desktop-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .auth-buttons, .user-menu {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logout-btn {
          color: var(--danger);
          border-color: #fecaca;
        }
        .logout-btn:hover {
          background-color: #fee2e2;
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--dark);
        }
        .mobile-menu {
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
        }
        .mobile-link {
          padding: 0.75rem 0;
          font-weight: 600;
          color: var(--dark);
          border-bottom: 1px solid #f1f5f9;
        }
        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }
        @media (max-width: 992px) {
          .desktop-nav, .desktop-actions {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
