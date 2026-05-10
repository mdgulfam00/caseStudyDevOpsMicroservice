import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

const CreateTask = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('home');
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    profileImage: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadTasks();
  }, [navigate]);

  const loadTasks = async () => {
    try {
      const response = await taskAPI.getAllTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const getTaskCounts = () => {
    if (!user || !tasks.length) return { all: 0, done: 0, assigned: 0, rejected: 0, unassigned: 0 };
    
    const done = tasks.filter(task => task.status === 'DONE').length;
    const assigned = tasks.filter(task => task.assignedUsers && task.assignedUsers.length > 0 && task.status !== 'DONE' && task.status !== 'REJECTED').length;
    const rejected = tasks.filter(task => task.status === 'REJECTED').length;
    const unassigned = tasks.filter(task => !task.assignedUsers || task.assignedUsers.length === 0).length;
    
    return {
      all: tasks.length,
      done,
      assigned,
      rejected,
      unassigned
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const task = {
        ...taskData,
        tags: taskData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      await taskAPI.createTask(task);
      setToast({ message: 'Task created successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setToast({ message: 'Error creating task', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div style={{display: 'flex'}}>
        <Sidebar 
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          taskCounts={getTaskCounts()}
          user={user}
        />
        <div className="container" style={{flex: 1, marginLeft: '280px', marginTop: '80px'}}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white', padding: '2rem', borderRadius: '25px',
            marginBottom: '2rem', textAlign: 'center',
            boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)'
          }}>
            <h2 style={{fontSize: '2.2rem', fontWeight: '700', marginBottom: '0.5rem'}}>✨ Create New Task</h2>
            <p style={{opacity: '0.9'}}>Design and assign new projects to your team</p>
          </div>
          
          <div style={{
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            borderRadius: '25px', padding: '3rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            maxWidth: '800px', margin: '0 auto'
          }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  📝 Task Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={taskData.name}
                  onChange={(e) => setTaskData({...taskData, name: e.target.value})}
                  placeholder="Enter a descriptive task name..."
                  style={{fontSize: '1.1rem', padding: '1.2rem'}}
                  required
                />
              </div>
              
              <div className="form-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  📜 Description:
                </label>
                <textarea
                  className="form-control"
                  rows="5"
                  value={taskData.description}
                  onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                  placeholder="Provide detailed task requirements and expectations..."
                  style={{fontSize: '1rem', padding: '1.2rem', resize: 'vertical'}}
                  required
                />
              </div>
              
              <div className="form-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  🖼️ Profile Image URL:
                </label>
                <input
                  type="url"
                  className="form-control"
                  value={taskData.profileImage}
                  onChange={(e) => setTaskData({...taskData, profileImage: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  style={{fontSize: '1rem', padding: '1.2rem'}}
                  required
                />
              </div>
              
              <div className="form-group">
                <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  🏷️ Technologies/Tags:
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={taskData.tags}
                  onChange={(e) => setTaskData({...taskData, tags: e.target.value})}
                  placeholder="React, JavaScript, Node.js, MongoDB"
                  style={{fontSize: '1rem', padding: '1.2rem'}}
                />
                <small style={{color: '#666', fontSize: '0.9rem', marginTop: '0.5rem', display: 'block'}}>
                  Separate multiple tags with commas
                </small>
              </div>
              
              <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem'}}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{
                    fontSize: '1.1rem', padding: '1rem 2.5rem',
                    minWidth: '180px'
                  }}
                >
                  {isSubmitting ? '⏳ Creating...' : '✨ Create Task'}
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/dashboard')}
                  className="btn"
                  style={{
                    fontSize: '1.1rem', padding: '1rem 2.5rem',
                    background: '#6c757d', color: 'white'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default CreateTask;