import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 50, borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
      <div className="container flex justify-between items-center" style={{ height: '70px' }}>
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <GraduationCap size={32} color="var(--primary-light)" />
          <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            EduConnect
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-outline" style={{ textDecoration: 'none', padding: '0.4rem 1rem' }}>Log In</Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '0.4rem 1rem' }}>Sign Up</Link>
            </>
          ) : (
            <>
              <div style={{ marginRight: '1rem', color: 'var(--text-muted)' }}>
                Hello, <strong className="text-gradient">{user?.name || user?.sub || user?.email || "User"}</strong>
              </div>
              <Link to={user?.role === 'instructor' ? "/instructor-dashboard" : "/student-dashboard"} className="btn-primary" style={{ textDecoration: 'none', padding: '0.4rem 1rem' }}>Dashboard</Link>
              <button onClick={handleLogout} className="btn-outline flex items-center gap-2" style={{ padding: '0.4rem 1rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
