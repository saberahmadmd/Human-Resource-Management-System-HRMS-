import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <header className="navbar-root">
      <div className="navbar-left">
        <h1 className="navbar-title">Evallo HRMS</h1>
        <span className="navbar-pill">Tutoring Business Automation</span>
      </div>
      <div className="navbar-right">
        <button className="navbar-logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
