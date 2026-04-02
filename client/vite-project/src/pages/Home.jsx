import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex-col items-center justify-center pt-10 pb-20 text-center animate-slide-up">
      <div className="glass-panel" style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '50px', marginBottom: '2rem' }}>
        <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>🚀 Welcome to the Future of Education</span>
      </div>
      
      <h1 style={{ fontSize: '4.5rem', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
        Learn & Teach<br />
        <span className="text-gradient">Without Limits</span>
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        A premium platform connecting instructors with ambitious students. Manage your courses, enroll in new ones, and master your future.
      </p>
      
      <div className="flex justify-center gap-4">
        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2rem', fontSize: '1.1rem' }}>Get Started</Link>
        <Link to="/login" className="btn-outline" style={{ textDecoration: 'none', padding: '1rem 2rem', fontSize: '1.1rem' }}>Login</Link>
      </div>

      <div className="grid grid-cols-3 gap-6" style={{ marginTop: '5rem', textAlign: 'left' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <BookOpen color="var(--primary-light)" size={40} style={{ marginBottom: '1rem' }} />
          <h3>Vast Library</h3>
          <p className="text-muted mt-4">Access a wide variety of courses ranging from technology to arts.</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <Users color="var(--secondary)" size={40} style={{ marginBottom: '1rem' }} />
          <h3>Expert Instructors</h3>
          <p className="text-muted mt-4">Learn directly from verified professionals in their respective industries.</p>
        </div>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <Award color="var(--accent)" size={40} style={{ marginBottom: '1rem' }} />
          <h3>Certified Value</h3>
          <p className="text-muted mt-4">Prove your skills to the world securely and seamlessly.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
