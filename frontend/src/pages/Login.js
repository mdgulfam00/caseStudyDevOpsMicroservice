import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'USER'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        await authAPI.signup(formData);
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '25px',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center'
      }}>
        <div style={{
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            {isLogin ? '👋 Welcome Back' : '🚀 Join Us'}
          </h1>
          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            margin: 0
          }}>
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <div style={{position: 'relative'}}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem',
                  color: '#667eea'
                }}>👤</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  style={{
                    paddingLeft: '3rem',
                    fontSize: '1.1rem',
                    padding: '1.2rem 1.2rem 1.2rem 3rem'
                  }}
                  required
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <div style={{position: 'relative'}}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2rem',
                color: '#667eea'
              }}>📧</span>
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  paddingLeft: '3rem',
                  fontSize: '1.1rem',
                  padding: '1.2rem 1.2rem 1.2rem 3rem'
                }}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div style={{position: 'relative'}}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2rem',
                color: '#667eea'
              }}>🔒</span>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{
                  paddingLeft: '3rem',
                  fontSize: '1.1rem',
                  padding: '1.2rem 1.2rem 1.2rem 3rem'
                }}
                required
              />
            </div>
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <div style={{position: 'relative'}}>
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem',
                  color: '#667eea'
                }}>👔</span>
                <select
                  className="form-control"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{
                    paddingLeft: '3rem',
                    fontSize: '1.1rem',
                    padding: '1.2rem 1.2rem 1.2rem 3rem'
                  }}
                >
                  <option value="USER">👨‍💻 Employee</option>
                  <option value="ADMIN">👨‍💼 Project Manager</option>
                </select>
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{
              width: '100%',
              fontSize: '1.2rem',
              padding: '1rem 2rem',
              marginTop: '1rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {isLogin ? '🚀 Sign In' : '✨ Create Account'}
          </button>
        </form>
        
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '15px'
        }}>
          <p style={{
            margin: '0 0 0.5rem 0',
            color: '#666',
            fontSize: '1rem'
          }}>
            {isLogin ? "Don't have an account?" : "Already have an account????"}
          </p>
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? '📝 Sign Up Here' : '🔑 Login Here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
