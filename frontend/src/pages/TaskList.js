import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI, submissionAPI } from '../services/api';
import Navbar from '../components/Navbar';

const TaskList = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [githubLink, setGithubLink] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadTasks(parsedUser);
  }, [navigate]);

  const loadTasks = async (userData) => {
    try {
      let response;
      if (userData.role === 'ADMIN') {
        response = await taskAPI.getAllTasks();
      } else {
        response = await taskAPI.getUserTasks(userData.id);
      }
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
        alert('Task deleted successfully!');
      } catch (error) {
        alert('Error deleting task');
      }
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      await submissionAPI.submitTask({
        taskId: selectedTask.id,
        userId: user.id,
        githubLink: githubLink
      });
      alert('Task submitted successfully!');
      setSelectedTask(null);
      setGithubLink('');
    } catch (error) {
      alert('Error submitting task');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container">
      <h2>Tasks</h2>
      
      <div className="task-grid">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <h4>{task.name}</h4>
            <p>{task.description}</p>
            <span className={`task-status status-${task.status.toLowerCase()}`}>
              {task.status}
            </span>
            <div style={{marginTop: '10px'}}>
              <strong>Tags:</strong> {task.tags?.join(', ')}
            </div>
            <div style={{marginTop: '15px'}}>
              {user.role === 'ADMIN' ? (
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="btn btn-danger"
                >
                  Delete Task
                </button>
              ) : (
                task.status === 'ASSIGNED' && (
                  <button 
                    onClick={() => setSelectedTask(task)}
                    className="btn btn-primary"
                  >
                    Submit Task
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h3>Submit Task: {selectedTask.name}</h3>
            <form onSubmit={handleSubmitTask}>
              <div className="form-group">
                <label>GitHub Link:</label>
                <input
                  type="url"
                  className="form-control"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  required
                />
              </div>
              <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <button 
                  type="button" 
                  onClick={() => setSelectedTask(null)}
                  className="btn"
                  style={{backgroundColor: '#6c757d', color: 'white'}}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TaskList;