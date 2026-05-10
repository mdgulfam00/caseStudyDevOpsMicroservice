import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
    <nav className="navbar">
      <h1>Project Manager</h1>
      <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        {user.role === 'ADMIN' && <NotificationBell />}
        <div className="nav-links">
          {user.role === 'ADMIN' && <Link to="/create-task">Create Task</Link>}
          <Link to="/submissions">Submissions</Link>
        </div>
        <div style={{position: 'relative'}} className="profile-menu">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              cursor: 'pointer', padding: '8px 12px',
              borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.1)'
            }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: '#007bff', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 'bold'
            }}>
              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span style={{color: 'white', fontSize: '14px'}}>
              {user.fullName || 'User'}
            </span>
            <span style={{color: 'white', fontSize: '12px'}}>▼</span>
          </div>
          {showProfileMenu && (
            <div style={{
              position: 'absolute', right: 0, top: '45px',
              backgroundColor: 'white', border: '1px solid #ddd',
              borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: '180px', zIndex: 1000
            }}>
              <button
                onClick={() => {
                  setShowProfileModal(true);
                  setShowProfileMenu(false);
                }}
                style={{
                  width: '100%', padding: '12px 16px', border: 'none',
                  background: 'none', textAlign: 'left', cursor: 'pointer',
                  color: '#333', display: 'flex', alignItems: 'center', gap: '10px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span>👤</span> View Profile
              </button>
              <button 
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setShowProfileMenu(false);
                }}
                style={{
                  display: 'block', width: '100%', padding: '12px 16px',
                  border: 'none', background: 'none', textAlign: 'left',
                  cursor: 'pointer', color: '#dc3545', fontWeight: '500'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
    
    {/* Profile Modal */}
    {showProfileModal && (
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}
        onClick={() => setShowProfileModal(false)}
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
            👤
          </div>
          <h3 style={{
            fontSize: '1.8rem', fontWeight: '700', color: '#333',
            marginBottom: '0.5rem'
          }}>
            {user?.fullName}
          </h3>
          <p style={{
            color: '#667eea', fontSize: '1.1rem', fontWeight: '600',
            marginBottom: '2rem'
          }}>
            {user?.role === 'ADMIN' ? '👨‍💼 Project Manager' : '👨‍💻 Employee'}
          </p>
          
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            borderRadius: '15px', padding: '1.5rem', marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <div style={{marginBottom: '1rem'}}>
              <strong style={{color: '#495057'}}>📧 Email:</strong>
              <p style={{margin: '0.5rem 0 0 0', color: '#6c757d'}}>{user?.email}</p>
            </div>
            <div style={{marginBottom: '1rem'}}>
              <strong style={{color: '#495057'}}>🎯 Role:</strong>
              <p style={{margin: '0.5rem 0 0 0', color: '#6c757d'}}>
                {user?.role === 'ADMIN' ? 'Project Manager' : 'Employee'}
              </p>
            </div>
            <div>
              <strong style={{color: '#495057'}}>✅ Completed Tasks:</strong>
              <p style={{margin: '0.5rem 0 0 0', color: '#6c757d', fontSize: '1.2rem', fontWeight: '600'}}>
                {user?.completedTasks || 0}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowProfileModal(false)}
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
            ✨ Close
          </button>
        </div>
      </div>
    )}
    
    {/* Logout Confirmation Modal */}
    {showLogoutConfirm && (
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}
        onClick={() => setShowLogoutConfirm(false)}
      >
        <div 
          style={{
            backgroundColor: 'white', padding: '2.5rem', borderRadius: '20px',
            width: '400px', textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            fontSize: '4rem', marginBottom: '1rem'
          }}>
            🚪
          </div>
          <h3 style={{
            fontSize: '1.5rem', fontWeight: '700', color: '#333',
            marginBottom: '1rem'
          }}>
            Logout Confirmation
          </h3>
          <p style={{
            color: '#666', fontSize: '1rem', lineHeight: '1.5',
            marginBottom: '2rem'
          }}>
            Are you sure you want to logout from your account?
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
            <button 
              onClick={() => {
                handleLogout();
                setShowLogoutConfirm(false);
              }}
              style={{
                background: 'linear-gradient(135deg, #dc3545, #c82333)',
                color: 'white', border: 'none', borderRadius: '25px',
                padding: '0.8rem 2rem', fontSize: '1rem', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(220, 53, 69, 0.4)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.4)';
              }}
            >
              🚪 Logout
            </button>
            <button 
              onClick={() => setShowLogoutConfirm(false)}
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
    </>
  );
};

export default Navbar;