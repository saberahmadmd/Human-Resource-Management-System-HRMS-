import { Outlet, NavLink } from 'react-router-dom';
import './Layout.css';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="layout-root">
      <Navbar />

      <main className="layout-main">
        <aside className="layout-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-logo">HR</span>
            <div>
              <div className="sidebar-title">HRMS</div>
              <div className="sidebar-subtitle">Evallo Assignment</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
              }
            >
              Employees
            </NavLink>
            <NavLink
              to="/teams"
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
              }
            >
              Teams
            </NavLink>
            <NavLink
              to="/logs"
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
              }
            >
              Logs
            </NavLink>
          </nav>

          {user && (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{user.name}</div>
                <div className="sidebar-user-email">{user.email}</div>
              </div>
            </div>
          )}
        </aside>

        <section className="layout-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
