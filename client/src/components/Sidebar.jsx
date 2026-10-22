import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  History,
  User,
  Users,
  UserCheck,
  Building2,
  Settings,
  LogOut,
  Cross,
} from 'lucide-react';

const Sidebar = ({ role = 'patient' }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const patientLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Book Appointment', path: '/patient/book', icon: Calendar },
    { name: 'Upcoming Appointments', path: '/patient/appointments', icon: Clock },
    { name: 'Appointment History', path: '/patient/history', icon: History },
    { name: 'My Profile', path: '/patient/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Doctors', path: '/admin/doctors', icon: UserCheck },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Departments', path: '/admin/departments', icon: Building2 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = role === 'admin' ? adminLinks : patientLinks;

  return (
    <aside className="portal-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-user-badge">
          <div className="avatar-circle">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info-text">
            <span className="user-name">{currentUser?.name || 'User'}</span>
            <span className="user-role-tag">{role === 'admin' ? 'Administrator' : 'Patient'}</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              <Icon size={19} className="link-icon" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout-btn">
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>

      <style>{`
        .portal-sidebar {
          width: 260px;
          background-color: #ffffff;
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - 75px);
          padding: 1.5rem 1rem;
        }
        .sidebar-header {
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1.5rem;
        }
        .sidebar-user-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .avatar-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.15rem;
          box-shadow: 0 4px 8px rgba(2, 132, 199, 0.25);
        }
        .user-info-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .user-name {
          font-weight: 700;
          color: var(--dark);
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-role-tag {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 600;
          text-transform: uppercase;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex-grow: 1;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-main);
          font-weight: 500;
          font-size: 0.92rem;
          transition: var(--transition);
        }
        .sidebar-link:hover {
          background-color: #f1f5f9;
          color: var(--primary);
        }
        .sidebar-link.active {
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 700;
        }
        .link-icon {
          flex-shrink: 0;
        }
        .sidebar-footer {
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
        .sidebar-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          background-color: #fee2e2;
          color: #b91c1c;
          font-weight: 600;
          font-size: 0.92rem;
        }
        .sidebar-logout-btn:hover {
          background-color: #fca5a5;
        }
        @media (max-width: 768px) {
          .portal-sidebar {
            width: 100%;
            min-height: auto;
            border-right: none;
            border-bottom: 1px solid var(--border-color);
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
