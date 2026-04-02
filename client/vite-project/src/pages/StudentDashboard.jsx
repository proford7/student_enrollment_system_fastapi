import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Book } from 'lucide-react';

const StudentDashboard = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user && user.role === 'student') {
      const fetchCourses = async () => {
        try {
          const res = await api.get('/courses');
          setCourses(res.data);
        } catch (err) {
          console.error("Failed to fetch courses");
        }
      };
      fetchCourses();
    }
  }, [user, refresh]);

  if (loading || !user) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  const handleEnroll = async (id) => {
    try {
      await api.post('/enroll', { course_id: id });
      alert("Enrolled successfully!");
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to enroll. You might already be enrolled.");
    }
  };

  const handleDrop = async (id) => {
    try {
      await api.delete('/drop', { data: { course_id: id } }); // pass data body for DELETE
      alert("Course dropped successfully.");
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to drop course.");
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1>Student Dashboard</h1>
        <p className="text-muted mt-4">Welcome back, <strong className="text-gradient">{user.name || user.email || "Student"}</strong>.</p>
      </div>

      <h2 className="mb-6">Available Courses Catalog</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? <p className="text-muted">No courses available at the moment.</p> : courses.map(course => (
           <div key={course.id || course._id} className="glass-card p-4" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem', width: 'fit-content', padding: '10px', background: 'rgba(236,72,153,0.1)', borderRadius: '12px' }}>
              <Book color="var(--secondary)" size={24} />
            </div>
            <h3>{course.title}</h3>
            <p className="text-muted mt-2 mb-4 flex-grow">{course.description}</p>
            
            <div className="flex gap-2">
              <button className="btn-primary flex-grow text-center justify-center" onClick={() => handleEnroll(course.id || course._id)}>
                Enroll
              </button>
              <button className="btn-outline flex-grow text-center justify-center" onClick={() => handleDrop(course.id || course._id)}>
                Drop
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
