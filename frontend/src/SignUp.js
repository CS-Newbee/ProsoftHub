import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://prosofthub-production.up.railway.app';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    adminCode: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ NEW STATES
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ADMIN_CODES = {
    'President': 'PRES200',
    'Advisor': 'ADV100'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('❌ Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('❌ Password min 6 characters!');
      return;
    }

    if (
      (formData.role === 'President' || formData.role === 'Advisor') &&
      formData.adminCode !== ADMIN_CODES[formData.role]
    ) {
      setError(`❌ Invalid ${formData.role} access code!`);
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        role: formData.role.toLowerCase()
      });

      alert('Account created successfully!');
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed! Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/signup-bg.jpg)` }}>
      <div className="signup-container">
        <div className="signup-box">
          <h2>Sign Up</h2>

          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required autoComplete="off" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required autoComplete="off" />

            {/* ✅ PASSWORD FIELD */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password (min 6)"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="off"
                style={{ width: '100%', paddingRight: '50px' }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                {showPassword ? '🙈' : '🐵'}
              </span>
            </div>

            {/* ✅ CONFIRM PASSWORD */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="off"
                style={{ width: '100%', paddingRight: '50px' }}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                {showConfirmPassword ? '🙈' : '🐵'}
              </span>
            </div>

            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="" disabled>Select Role</option>
              <option value="President">President</option>
              <option value="Advisor">Advisor</option>
              <option value="Member">Member</option>
            </select>

            {(formData.role === 'President' || formData.role === 'Advisor') && (
              <input
                type="text"
                name="adminCode"
                placeholder={`${formData.role} Code`}
                value={formData.adminCode}
                onChange={handleChange}
                required
              />
            )}

            {error && (
              <p style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', margin: '0' }}>
                {error}
              </p>
            )}

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>

          <p className="signin-link">
            Already registered? <span onClick={() => navigate('/signin')}>Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;