import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyle = () => {
    const baseStyle = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: '15px',
      color: 'white',
      fontWeight: '600',
      fontSize: '0.9rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      zIndex: 10000,
      minWidth: '300px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideIn 0.3s ease-out'
    };

    switch (type) {
      case 'success':
        return { ...baseStyle, background: 'linear-gradient(135deg, #28a745, #20c997)' };
      case 'error':
        return { ...baseStyle, background: 'linear-gradient(135deg, #dc3545, #fd7e14)' };
      case 'warning':
        return { ...baseStyle, background: 'linear-gradient(135deg, #ffc107, #fd7e14)' };
      case 'info':
        return { ...baseStyle, background: 'linear-gradient(135deg, #17a2b8, #6f42c1)' };
      default:
        return { ...baseStyle, background: 'linear-gradient(135deg, #28a745, #20c997)' };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={getToastStyle()}>
        <span style={{ fontSize: '1.2rem' }}>{getIcon()}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer',
            marginLeft: 'auto',
            opacity: 0.7
          }}
        >
          ×
        </button>
      </div>
    </>
  );
};

export default Toast;