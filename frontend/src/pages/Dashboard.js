import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI, authAPI, submissionAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [assigningTask, setAssigningTask] = useState(null);
  const [submittingTask, setSubmittingTask] = useState(null);
  const [viewingSubmissions, setViewingSubmissions] = useState(null);
  const [taskSubmissions, setTaskSubmissions] = useState([]);
  const [deletingTask, setDeletingTask] = useState(null);
  const [assigningConfirm, setAssigningConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeFilter, setActiveFilter] = useState('home');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    if (parsedUser.role === 'ADMIN') {
      loadAllTasks();
      loadAllUsers();
    } else {
      loadUserTasks(parsedUser.id);
    }
  }, [navigate]);



  const loadAllTasks = async () => {
    try {
      const response = await taskAPI.getAllTasks();
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadUserTasks = async (userId) => {
    try {
      const response = await taskAPI.getUserTasks(userId);
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error('Error loading user tasks:', error);
    }
  };

  const loadAllUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const getAssignedUserNames = (assignedUserIds) => {
    if (!assignedUserIds || assignedUserIds.length === 0) return 'Not assigned';
    const assignedUsers = users.filter(user => assignedUserIds.includes(user.id));
    return assignedUsers.map(user => user.fullName).join(', ');
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      setDeletingTask(null);
      setShowMenu(null);
      setToast({ message: 'Task deleted successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error deleting task', type: 'error' });
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      await taskAPI.updateTask(editingTask.id, taskData);
      loadAllTasks();
      setEditingTask(null);
      setToast({ message: 'Task updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error updating task', type: 'error' });
    }
  };

  const handleFilterChange = (filter) => {
    if (!user) return;
    
    setActiveFilter(filter);
    let filtered = [];
    
    if (user.role === 'ADMIN') {
      switch(filter) {
        case 'home':
          filtered = tasks;
          break;
        case 'done':
          filtered = tasks.filter(task => task.status === 'DONE');
          break;
        case 'assigned':
          filtered = tasks.filter(task => task.assignedUsers && task.assignedUsers.length > 0 && task.status !== 'DONE' && task.status !== 'REJECTED');
          break;
        case 'rejected':
          filtered = tasks.filter(task => task.status === 'REJECTED');
          break;
        case 'unassigned':
          filtered = tasks.filter(task => !task.assignedUsers || task.assignedUsers.length === 0);
          break;
        default:
          filtered = tasks;
      }
    } else {
      // Employee filtering
      switch(filter) {
        case 'home':
          filtered = tasks;
          break;
        case 'done':
          filtered = tasks.filter(task => task.status === 'DONE');
          break;
        case 'assigned':
          filtered = tasks.filter(task => task.status !== 'DONE' && task.status !== 'REJECTED');
          break;
        case 'rejected':
          filtered = tasks.filter(task => task.status === 'REJECTED');
          break;
        case 'unassigned':
          filtered = [];
          break;
        default:
          filtered = tasks;
      }
    }
    
    setFilteredTasks(filtered);
  };

  const getTaskCounts = () => {
    if (!user) return { all: 0, assigned: 0, unassigned: 0 };
    
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

  useEffect(() => {
    if (user && tasks.length > 0) {
      handleFilterChange(activeFilter);
    }
  }, [tasks, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.menu-container')) {
        setShowMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu]);

  const handleAssignTask = async (taskId, userId) => {
    try {
      await taskAPI.assignTask(taskId, userId);
      // Update task status to ASSIGNED when task is assigned
      const taskToUpdate = tasks.find(t => t.id === taskId);
      await taskAPI.updateTask(taskId, {
        ...taskToUpdate,
        status: 'ASSIGNED'
      });
      loadAllTasks();
      setAssigningTask(null);
      setToast({ message: 'Task assigned successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error assigning task', type: 'error' });
    }
  };

  const handleSubmitTask = async (submissionData) => {
    try {
      await submissionAPI.submitTask({
        taskId: submittingTask.id,
        userId: user.id,
        githubLink: submissionData.githubLink,
        description: submissionData.description
      });
      
      setSubmittingTask(null);
      setToast({ 
        message: submittingTask.status === 'REJECTED' ? 'Task resubmitted successfully! Waiting for manager approval.' : 'Task submitted successfully!', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Submission error:', error);
      setToast({ message: 'Error submitting task: ' + (error.response?.data?.message || error.message), type: 'error' });
    }
  };

  const handleViewSubmissions = async (task) => {
    try {
      const response = await submissionAPI.getSubmissionsByTask(task.id);
      setTaskSubmissions(response.data);
      setViewingSubmissions(task);
      setShowMenu(null);
    } catch (error) {
      setToast({ message: 'Error loading submissions', type: 'error' });
    }
  };

  const handleAcceptSubmission = async (submissionId) => {
    try {
      await submissionAPI.acceptSubmission(submissionId);
      // Update task status to DONE when submission is accepted
      await taskAPI.updateTaskStatus(viewingSubmissions.id, 'DONE');
      
      // Refresh user data to update completed tasks count
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const updatedUser = { ...parsedUser, completedTasks: (parsedUser.completedTasks || 0) + 1 };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      loadAllTasks();
      handleViewSubmissions(viewingSubmissions);
      setToast({ message: 'Submission accepted! Task moved to DONE.', type: 'success' });
    } catch (error) {
      console.error('Error accepting submission:', error);
      setToast({ message: 'Error accepting submission', type: 'error' });
    }
  };

  const handleRejectSubmission = async (submissionId) => {
    try {
      await submissionAPI.rejectSubmission(submissionId);
      // Set task status to REJECTED when submission is rejected
      await taskAPI.updateTaskStatus(viewingSubmissions.id, 'REJECTED');
      await loadAllTasks();
      handleViewSubmissions(viewingSubmissions);
      setToast({ message: 'Submission rejected! Task remains in REJECTED section.', type: 'warning' });
    } catch (error) {
      console.error('Error rejecting submission:', error);
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
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white', padding: '1.5rem', borderRadius: '20px',
            marginBottom: '1.5rem', textAlign: 'center',
            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
          }}>
            <h2 style={{fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>Welcome, {user.fullName}!</h2>
            <p style={{margin: '5px 0', fontSize: '0.9rem', opacity: '0.9'}}>Role: {user.role === 'ADMIN' ? 'Project Manager' : 'Employee'}</p>

          </div>
          
          <h3 style={{
            fontSize: '1.8rem', fontWeight: '700', color: '#333',
            marginBottom: '1.5rem', textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            {user.role === 'ADMIN' 
              ? `${activeFilter.toUpperCase()} Projects (${filteredTasks.length})`
              : 'My Assigned Tasks'
            }
          </h3>
          <div className="task-grid">
            {filteredTasks.map(task => (
            <div key={task.id} className="task-card">
              <div style={{display: 'flex', gap: '1.5rem', alignItems: 'stretch'}}>
                {task.profileImage && (
                  <img 
                    src={task.profileImage} 
                    alt={task.name}
                    style={{
                      width: '150px', height: '200px', borderRadius: '12px',
                      objectFit: 'cover', flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: '3px solid #e1e5e9'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <h4>{task.name}</h4>
                <div style={{position: 'relative'}} className="menu-container">
                  <button 
                    onClick={() => setShowMenu(showMenu === task.id ? null : task.id)}
                    style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      fontSize: '18px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    ⋮
                  </button>
                  {showMenu === task.id && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '40px',
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '15px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      minWidth: '180px',
                      overflow: 'hidden',
                      backdropFilter: 'blur(10px)'
                    }}>
                      {user.role === 'ADMIN' ? (
                        <>
                          <button 
                            onClick={() => {setEditingTask(task); setShowMenu(null);}}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              width: '100%', padding: '12px 16px', border: 'none',
                              background: 'none', textAlign: 'left', cursor: 'pointer',
                              fontSize: '14px', fontWeight: '500',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                            }}
                          >
                            <span>✏️</span> Edit
                          </button>
                          <button 
                            onClick={() => {setDeletingTask(task); setShowMenu(null);}}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              width: '100%', padding: '12px 16px', border: 'none',
                              background: 'none', textAlign: 'left', cursor: 'pointer',
                              fontSize: '14px', fontWeight: '500', color: '#dc3545',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#fff5f5';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                            }}
                          >
                            <span>🗑️</span> Delete
                          </button>
                          <button 
                            onClick={() => {setAssigningTask(task); setShowMenu(null);}}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              width: '100%', padding: '12px 16px', border: 'none',
                              background: 'none', textAlign: 'left', cursor: 'pointer',
                              fontSize: '14px', fontWeight: '500',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                            }}
                          >
                            <span>👥</span> Assign
                          </button>
                          <button 
                            onClick={() => handleViewSubmissions(task)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              width: '100%', padding: '12px 16px', border: 'none',
                              background: 'none', textAlign: 'left', cursor: 'pointer',
                              fontSize: '14px', fontWeight: '500',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                            }}
                          >
                            <span>📋</span> View Submissions
                          </button>
                        </>
                      ) : (
                        <>
                          {task.status === 'ASSIGNED' && task.assignedUsers?.includes(user.id) && (
                            <button 
                              onClick={() => {setSubmittingTask(task); setShowMenu(null);}}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                width: '100%', padding: '12px 16px', border: 'none',
                                background: 'none', textAlign: 'left', cursor: 'pointer',
                                fontSize: '14px', fontWeight: '500',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                              }}
                            >
                              <span>📤</span> Submit Task
                            </button>
                          )}
                          {task.status === 'REJECTED' && task.assignedUsers?.includes(user.id) && (
                            <button 
                              onClick={() => {setSubmittingTask(task); setShowMenu(null);}}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                width: '100%', padding: '12px 16px', border: 'none',
                                background: 'none', textAlign: 'left', cursor: 'pointer',
                                fontSize: '14px', fontWeight: '500', color: '#ff6b6b',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#fff5f5';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                              }}
                            >
                              <span>🔄</span> Resubmit Task
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  </div>
                  </div>
                  <p>{task.description}</p>
                  <span className={`task-status status-${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                  <div style={{marginTop: '10px'}}>
                    <strong>Tags:</strong> {task.tags?.join(', ')}
                  </div>
                  {user.role === 'ADMIN' && task.assignedUsers?.length > 0 && (
                    <div style={{marginTop: '10px'}}>
                      <strong>Assigned to:</strong> {getAssignedUserNames(task.assignedUsers)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Assignment Confirmation Modal */}
      {assigningConfirm && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}
          onClick={() => setAssigningConfirm(null)}
        >
          <div 
            style={{
              backgroundColor: 'white', padding: '2.5rem', borderRadius: '20px',
              width: '500px', textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              fontSize: '4rem', marginBottom: '1rem'
            }}>
              👥
            </div>
            <h3 style={{
              fontSize: '1.5rem', fontWeight: '700', color: '#333',
              marginBottom: '1rem'
            }}>
              Assign Task
            </h3>
            <p style={{
              color: '#666', fontSize: '1rem', lineHeight: '1.5',
              marginBottom: '2rem'
            }}>
              Are you sure you want to assign <strong>"{assigningConfirm.task.name}"</strong> to 
              <strong> {assigningConfirm.user.fullName}</strong>?
            </p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
              <button 
                onClick={() => {
                  handleAssignTask(assigningConfirm.task.id, assigningConfirm.user.id);
                  setAssigningConfirm(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white', border: 'none', borderRadius: '25px',
                  padding: '0.8rem 2rem', fontSize: '1rem', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                👥 Assign Task
              </button>
              <button 
                onClick={() => setAssigningConfirm(null)}
                style={{
                  background: '#f8f9fa', color: '#495057', border: '2px solid #e9ecef',
                  borderRadius: '25px', padding: '0.8rem 2rem', fontSize: '1rem',
                  fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#e9ecef';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTask && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}
          onClick={() => setDeletingTask(null)}
        >
          <div 
            style={{
              backgroundColor: 'white', padding: '2.5rem', borderRadius: '20px',
              width: '450px', textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              fontSize: '4rem', marginBottom: '1rem'
            }}>
              ⚠️
            </div>
            <h3 style={{
              fontSize: '1.5rem', fontWeight: '700', color: '#333',
              marginBottom: '1rem'
            }}>
              Delete Task
            </h3>
            <p style={{
              color: '#666', fontSize: '1rem', lineHeight: '1.5',
              marginBottom: '2rem'
            }}>
              Are you sure you want to delete <strong>"{deletingTask.name}"</strong>? 
              This action cannot be undone.
            </p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
              <button 
                onClick={() => handleDeleteTask(deletingTask.id)}
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                  color: 'white', border: 'none', borderRadius: '25px',
                  padding: '0.8rem 2rem', fontSize: '1rem', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
                }}
              >
                🗑️ Delete Task
              </button>
              <button 
                onClick={() => setDeletingTask(null)}
                style={{
                  background: '#f8f9fa', color: '#495057', border: '2px solid #e9ecef',
                  borderRadius: '25px', padding: '0.8rem 2rem', fontSize: '1rem',
                  fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#e9ecef';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}
          onClick={() => setEditingTask(null)}
        >
          <div 
            style={{
              backgroundColor: 'white', padding: '30px', borderRadius: '8px',
              width: '500px', maxHeight: '80vh', overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Task</h3>
            <EditTaskForm 
              task={editingTask} 
              onSave={handleEditTask} 
              onCancel={() => setEditingTask(null)} 
            />
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {assigningTask && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}
          onClick={() => setAssigningTask(null)}
        >
          <div 
            style={{
              backgroundColor: 'white', padding: '30px', borderRadius: '8px',
              width: '400px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Assign Task: {assigningTask.name}</h3>
            <div style={{maxHeight: '300px', overflow: 'auto'}}>
              {users.filter(u => u.role === 'USER').map(user => (
                <div key={user.id} style={{padding: '10px', borderBottom: '1px solid #eee'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span>{user.fullName} ({user.email})</span>
                    <button 
                      onClick={() => {
                        setAssigningConfirm({task: assigningTask, user: user});
                        setAssigningTask(null);
                      }}
                      className="btn btn-primary"
                      style={{fontSize: '12px', padding: '5px 10px'}}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign: 'center'}}>
              <button 
                onClick={() => setAssigningTask(null)}
                className="btn"
                style={{backgroundColor: '#6c757d', color: 'white', marginTop: '15px'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Task Modal */}
      {submittingTask && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}
          onClick={() => setSubmittingTask(null)}
        >
          <div 
            style={{
              backgroundColor: 'white', padding: '30px', borderRadius: '8px',
              width: '500px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Submit Task: {submittingTask.name}</h3>
            <SubmitTaskForm 
              task={submittingTask} 
              onSubmit={handleSubmitTask} 
              onCancel={() => setSubmittingTask(null)} 
            />
          </div>
        </div>
      )}

      {/* View Submissions Modal */}
      {viewingSubmissions && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}
          onClick={() => setViewingSubmissions(null)}
        >
          <div 
            style={{
              backgroundColor: 'white', padding: '30px', borderRadius: '8px',
              width: '700px', maxHeight: '80vh', overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Submissions for: {viewingSubmissions.name}</h3>
            {taskSubmissions.length === 0 ? (
              <p>No submissions found for this task.</p>
            ) : (
              <div>
                {taskSubmissions.map(submission => (
                  <div key={submission.id} style={{
                    border: '1px solid #ddd', borderRadius: '8px',
                    padding: '15px', margin: '10px 0'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div style={{flex: 1}}>
                        <p><strong>User ID:</strong> {submission.userId}</p>
                        <p><strong>Description:</strong> {submission.description}</p>
                        <p><strong>GitHub Link:</strong> 
                          <a href={submission.githubLink} target="_blank" rel="noopener noreferrer" style={{marginLeft: '5px'}}>
                            {submission.githubLink}
                          </a>
                        </p>
                        <p><strong>Submitted:</strong> {new Date(submission.submissionTime).toLocaleString()}</p>
                        <span className={`task-status status-${submission.status.toLowerCase()}`}>
                          {submission.status}
                        </span>
                      </div>
                      {submission.status === 'PENDING' && (
                        <div style={{display: 'flex', gap: '10px', marginLeft: '15px'}}>
                          <button 
                            onClick={() => handleAcceptSubmission(submission.id)}
                            className="btn btn-primary"
                            style={{backgroundColor: '#28a745', fontSize: '12px', padding: '5px 10px'}}
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleRejectSubmission(submission.id)}
                            className="btn btn-danger"
                            style={{fontSize: '12px', padding: '5px 10px'}}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{textAlign: 'center'}}>
              <button 
                onClick={() => setViewingSubmissions(null)}
                className="btn"
                style={{backgroundColor: '#6c757d', color: 'white', marginTop: '15px'}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
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

// Edit Task Form Component
const EditTaskForm = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: task.name,
    description: task.description,
    profileImage: task.profileImage || '',
    tags: task.tags?.join(', ') || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSave(taskData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Task Name:</label>
        <input
          type="text"
          className="form-control"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea
          className="form-control"
          rows="4"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>Profile Image URL:</label>
        <input
          type="url"
          className="form-control"
          value={formData.profileImage}
          onChange={(e) => setFormData({...formData, profileImage: e.target.value})}
        />
      </div>
      <div className="form-group">
        <label>Tags (comma-separated):</label>
        <input
          type="text"
          className="form-control"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
        />
      </div>
      <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
        <button type="submit" className="btn btn-primary">Save Changes</button>
        <button type="button" onClick={onCancel} className="btn" style={{backgroundColor: '#6c757d', color: 'white'}}>Cancel</button>
      </div>
    </form>
  );
};

// Submit Task Form Component
const SubmitTaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    githubLink: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Task Description:</label>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Describe what you have completed..."
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>GitHub Link:</label>
        <input
          type="url"
          className="form-control"
          placeholder="https://github.com/username/repository"
          value={formData.githubLink}
          onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
          required
        />
      </div>
      <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
        <button type="submit" className="btn btn-primary">Submit Task</button>
        <button type="button" onClick={onCancel} className="btn" style={{backgroundColor: '#6c757d', color: 'white'}}>Cancel</button>
      </div>
    </form>
  );
};

export default Dashboard;