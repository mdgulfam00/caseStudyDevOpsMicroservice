import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submissionAPI, taskAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

const Submissions = () => {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('home');
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
    loadSubmissions(parsedUser);
    loadTasks();
  }, [navigate]);

  const loadSubmissions = async (userData) => {
    try {
      let response;
      if (userData.role === 'ADMIN') {
        response = await submissionAPI.getAllSubmissions();
      } else {
        response = await submissionAPI.getSubmissionsByUser(userData.id);
      }
      
      // Enhance submissions with task names
      const submissionsWithTaskNames = await Promise.all(
        response.data.map(async (submission) => {
          try {
            const taskResponse = await taskAPI.getTaskById(submission.taskId);
            return {
              ...submission,
              taskName: taskResponse.data.name
            };
          } catch (error) {
            return {
              ...submission,
              taskName: `Task ${submission.taskId}`
            };
          }
        })
      );
      
      setSubmissions(submissionsWithTaskNames);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

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
    
    if (user.role === 'ADMIN') {
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
    } else {
      const done = tasks.filter(task => task.status === 'DONE').length;
      const assigned = tasks.filter(task => task.status !== 'DONE' && task.status !== 'REJECTED').length;
      const rejected = tasks.filter(task => task.status === 'REJECTED').length;
      
      return {
        all: tasks.length,
        done,
        assigned,
        rejected,
        unassigned: 0
      };
    }
  };

  const handleAcceptSubmission = async (submissionId) => {
    try {
      await submissionAPI.acceptSubmission(submissionId);
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId ? {...sub, status: 'ACCEPTED'} : sub
      ));
      setToast({ message: 'Submission accepted successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error accepting submission', type: 'error' });
    }
  };

  const handleRejectSubmission = async (submissionId) => {
    try {
      await submissionAPI.rejectSubmission(submissionId);
      setSubmissions(submissions.map(sub => 
        sub.id === submissionId ? {...sub, status: 'REJECTED'} : sub
      ));
      setToast({ message: 'Submission rejected!', type: 'warning' });
    } catch (error) {
      setToast({ message: 'Error rejecting submission', type: 'error' });
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
      <h2>{user.role === 'ADMIN' ? 'All Submissions' : 'My Submissions'}</h2>
      
      <div className="task-grid">
        {submissions.map(submission => (
          <div key={submission.id} className="task-card">
            <h4>{submission.taskName || `Task ${submission.taskId}`}</h4>
            <p><strong>User ID:</strong> {submission.userId}</p>
            <p><strong>GitHub Link:</strong> 
              <a href={submission.githubLink} target="_blank" rel="noopener noreferrer">
                {submission.githubLink}
              </a>
            </p>
            <p><strong>Submitted:</strong> {new Date(submission.submissionTime).toLocaleString()}</p>
            <span className={`task-status status-${submission.status.toLowerCase()}`}>
              {submission.status}
            </span>
            
            {user.role === 'ADMIN' && submission.status === 'PENDING' && (
              <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                <button 
                  onClick={() => handleAcceptSubmission(submission.id)}
                  className="btn btn-primary"
                  style={{backgroundColor: '#28a745'}}
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleRejectSubmission(submission.id)}
                  className="btn btn-danger"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {submissions.length === 0 && (
        <p>No submissions found.</p>
      )}
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

export default Submissions;