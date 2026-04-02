import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Book, Plus, Trash2, Users } from 'lucide-react';

const InstructorDashboard = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [roster, setRoster] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user && user.role === 'instructor') {
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

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;
    try {
      await api.post('/courses', newCourse);
      setNewCourse({ title: '', description: '' });
      setIsCreating(false);
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
      alert("Failed to create course");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course entirely?")) return;
    try {
      await api.delete(`/courses/${id}`);
      setRefresh(r => r + 1);
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  const handleViewRoster = async (id) => {
    try {
      const res = await api.get(`/courses/${id}/students`);
      setRoster(res.data.students || []);
    } catch (err) {
      console.error(err);
      alert("Failed to get roster");
    }
  };

  const myCreatedCourses = courses.filter(c => c.instructor_id === user.sub || c.instructor_id === user._id || c.instructor_id === user.id || c.instructor_id === user.email);

  return (
    <div className="animate-fade-in pb-20">
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1>Instructor Dashboard</h1>
        <p className="text-muted mt-4">Welcome, <strong className="text-gradient">{user.name || user.email || "Instructor"}</strong>.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2>Your Managed Courses</h2>
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsCreating(!isCreating)}>
          <Plus size={20} /> New Course
        </button>
      </div>

      {isCreating && (
        <div className="glass-card animate-slide-up" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 className="mb-4">Create a New Course</h3>
          <form onSubmit={handleCreateCourse}>
            <div className="input-group">
              <label>Title</label>
              <input type="text" className="input-field" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea className="input-field" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} style={{ minHeight: '100px' }} required></textarea>
            </div>
            <button type="submit" className="btn-primary">Publish Course</button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {myCreatedCourses.length === 0 ? <p className="text-muted">You haven't created any courses yet.</p> : myCreatedCourses.map(course => (
          <div key={course.id || course._id} className="glass-card p-4" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div className="flex justify-between items-start mb-4">
               <div style={{ padding: '10px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px' }}>
                <Book color="var(--primary-light)" size={24} />
               </div>
               <button className="btn-danger" onClick={() => handleDeleteCourse(course.id || course._id)} title="Delete Course">
                 <Trash2 size={16} />
               </button>
            </div>
            <h3>{course.title}</h3>
            <p className="text-muted mt-2 mb-4 flex-grow">{course.description}</p>
            
            <button className="btn-outline flex justify-center items-center gap-2 mt-4" onClick={() => handleViewRoster(course.id || course._id)}>
              <Users size={16} /> View Roster
            </button>
          </div>
        ))}
      </div>

      {roster && (
        <div className="glass-card animate-slide-up" style={{ padding: '2rem', marginTop: '3rem', position: 'relative' }}>
          <button 
            className="btn-danger" 
            style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none' }}
            onClick={() => setRoster(null)}>
            Close
          </button>
          <h3 className="mb-4">Course Roster</h3>
          {roster.length === 0 ? (
            <p className="text-muted">No students enrolled yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Student Name</th>
                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Email</th>
                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>Enrolled At</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map(st => (
                    <tr key={st.student_id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                       <td style={{ padding: '1rem 0' }}>{st.name}</td>
                       <td style={{ padding: '1rem 0' }}>{st.email}</td>
                       <td style={{ padding: '1rem 0' }}>{new Date(st.enrolled_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
