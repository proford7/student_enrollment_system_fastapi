import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
      }
    };

    verify();
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen animate-fade-in text-center">
        <h2>No Token Provided</h2>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen animate-fade-in text-center">
      <div className="glass-card" style={{ padding: '3rem', minWidth: '350px' }}>
        {status === 'verifying' && <h2>Verifying...</h2>}
        
        {status === 'success' && (
          <div>
            <CheckCircle color="var(--accent)" size={64} style={{ margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ marginBottom: '1rem' }}>Success!</h2>
            <p className="text-muted" style={{ marginBottom: '2.5rem' }}>Your email has been verified. Redirecting to login...</p>
            <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Go to Login</Link>
          </div>
        )}
        
        {status === 'error' && (
          <div>
             <XCircle color="red" size={64} style={{ margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ marginBottom: '1rem' }}>Verification Failed</h2>
            <p className="text-muted" style={{ marginBottom: '2.5rem' }}>The token might be invalid or expired.</p>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Register Again</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
