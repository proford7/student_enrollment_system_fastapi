import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Error registering account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '80vh' }}>
        <div className="glass-card text-center" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
          <div style={{ background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent)', height: '64px', width: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
             <UserPlus size={32} />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Success!</h2>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>Your account has been created. If email verification was configured, check your inbox. Otherwise, you'll be redirected to login.</p>
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
        <div className="text-center mb-8">
          <UserPlus size={40} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '2rem' }}>Create Account</h2>
          <p className="text-muted">Join our modern learning and teaching platform</p>
        </div>
        
        {error && (
          <div className="glass-panel" style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex-col">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" className="input-field" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input-field" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input-field" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="role">I am a...</label>
            <select id="role" name="role" className="input-field" value={formData.role} onChange={handleChange} style={{ appearance: 'none', backgroundColor: 'rgba(0,0,0,0.4)', color: 'var(--text-main)' }}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary w-full mt-4" disabled={loading} style={{ padding: '1rem' }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="text-center mt-6 text-muted" style={{ fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
