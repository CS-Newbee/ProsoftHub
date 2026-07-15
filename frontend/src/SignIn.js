import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert(`Welcome ${user.name || 'User'}!`);

      const role = user.role?.toLowerCase();
      if (role === 'president' || role === 'member') {
      // 🏠 Member aur President ka dashboard nahi bana, isliye inhen direct Home page bhej diya
      navigate('/');
      } else if (role === 'advisor') {
        navigate('/advisor-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 401) {
        setError('❌ Galat email ya password hai!');
      } else if (status === 400) {
        setError('⚠️ Email aur password dono zaroori hain!');
      } else if (status === 500) {
        setError('🔴 Server error! Thori dair baad try karein.');
      } else if (!err.response) {
        setError('🔌 Server se connection nahi ho raha. Backend chalu hai?');
      } else {
        setError(msg || '❌ Login fail! Credentials check karein.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="signin-page" 
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/signin-bg.jpg)` }}
    >
      <div className="signin-container">
        <div className="signin-box">
          <h2>Sign In</h2>
          
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            {/* ✅ Password Wrapper Fixed */}
            <div className="password-wrapper" style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={{ width: '100%', paddingRight: '50px' }} // Padding taake text emoji ke niche na jaye
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '20px', // Input border se thoda andar
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  zIndex: 10,
                  userSelect: 'none'
                }}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? '🙈' : '🐵'}
              </span>
            </div>

            {error && (
              <p style={{ color: '#ff4d4d', fontSize: '14px', marginTop: '5px', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="signup-link">
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;