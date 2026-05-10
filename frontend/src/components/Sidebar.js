import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ activeFilter, onFilterChange, taskCounts, user }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const handleCreateTask = () => {
    navigate('/create-task');
  };
  
  const filters = [
    { key: 'home', label: 'HOME', count: taskCounts.all, icon: '🏠' },
    { key: 'done', label: 'DONE', count: taskCounts.done, icon: '✅' },
    { key: 'assigned', label: 'ASSIGNED', count: taskCounts.assigned, icon: '👥' },
    { key: 'rejected', label: 'REJECTED TASKS', count: taskCounts.rejected, icon: '❌' },
    ...(user?.role === 'ADMIN' ? [{ key: 'unassigned', label: 'NOT ASSIGNED', count: taskCounts.unassigned, icon: '📋' }] : [])
  ];

  return (
    <div style={{
      width: '280px',
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      height: 'calc(100vh - 80px)',
      padding: '30px 0',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      top: '80px',
      left: 0,
      overflowY: 'auto',
      zIndex: 100
    }}>
      <div style={{padding: '0 25px', marginBottom: '30px'}}>
        <h4 style={{margin: '0 0 20px 0', color: 'white', fontSize: '1.2rem', fontWeight: '700', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>Filter Projects</h4>
      </div>
      
      {filters.map(filter => (
        <div
          key={filter.key}
          onClick={() => {
            if (location.pathname !== '/dashboard' && location.pathname !== '/') {
              navigate('/dashboard');
            } else {
              onFilterChange(filter.key);
            }
          }}
          style={{
            padding: '15px 25px',
            cursor: 'pointer',
            backgroundColor: activeFilter === filter.key ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            color: 'white',
            borderLeft: activeFilter === filter.key ? '4px solid #ffffff' : '4px solid transparent',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '5px 15px',
            borderRadius: '15px',
            transition: 'all 0.3s ease',
            fontWeight: activeFilter === filter.key ? '600' : '500'
          }}
          onMouseOver={(e) => {
            if (activeFilter !== filter.key) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateX(5px)';
            }
          }}
          onMouseOut={(e) => {
            if (activeFilter !== filter.key) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </div>
          <span style={{
            backgroundColor: activeFilter === filter.key ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '15px',
            fontSize: '11px',
            fontWeight: '700',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            {filter.count}
          </span>
        </div>
      ))}
      
      <div style={{borderTop: '1px solid rgba(255,255,255,0.2)', margin: '30px 20px'}}></div>
      
      {user?.role === 'ADMIN' && (
        <div
          onClick={handleCreateTask}
          style={{
            padding: '15px 25px',
            cursor: 'pointer',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '5px 15px',
            borderRadius: '15px',
            transition: 'all 0.3s ease',
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateX(5px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <span>➕</span>
          <span>CREATE NEW TASK</span>
        </div>
      )}
      
      <div
        onClick={() => setShowLogoutConfirm(true)}
        style={{
          padding: '15px 25px',
          cursor: 'pointer',
          color: '#ffcccb',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '5px 15px',
          borderRadius: '15px',
          transition: 'all 0.3s ease',
          fontWeight: '500'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 204, 203, 0.2)';
          e.currentTarget.style.transform = 'translateX(5px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <span>🚪</span>
        <span>LOGOUT</span>
      </div>
      
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
    </div>
  );
};

export default Sidebar;