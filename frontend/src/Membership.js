import React, { useState } from 'react';
import './Membership.css';

const Membership = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    year: '',
    reason: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Computer Science', 'Information Technology', 'Software Engineering',
    'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
    'Business Administration', 'Other'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Application submitted successfully! Wait for advisor approval.' });
        setFormData({ fullName: '', email: '', phone: '', studentId: '', department: '', year: '', reason: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Join Our Community</h2>
          <p>Fill out the form below to apply for membership.</p>
        </div>

        {status.message && (
          <div className={`alert ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Enter your full name" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="name@university.edu" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="03xx-xxxxxxx" />
            </div>
          </div>

          <div className="form-group">
            <label>Student ID</label>
            <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required placeholder="e.g. FA20-BCS-000" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Current Year</label>
              <select name="year" value={formData.year} onChange={handleChange} required>
                <option value="">Select Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Why do you want to join?</label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} required rows="4" placeholder="Tell us a bit about your interest..."></textarea>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Membership;