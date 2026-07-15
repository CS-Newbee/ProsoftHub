import React, { useState, useEffect } from 'react';
import './ManageMembership.css';

const ManageMembership = () => {
  // Dashboard State
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, rejected, all
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const departments = [
    'Computer Science',
    'Information Technology',
    'Software Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Other'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];

  // ==========================================
  // FETCH DATA FUNCTIONS
  // ==========================================

  const fetchMembers = async (status = '', dept = '', year = '', search = '') => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/members?';
      if (status && status !== 'all') url += `status=${status}&`;
      if (dept) url += `department=${encodeURIComponent(dept)}&`;
      if (year) url += `year=${encodeURIComponent(year)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/members/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // ==========================================
  // ACTION FUNCTIONS
  // ==========================================

  const handleApprove = async (memberId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/members/status/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', advisorName: 'Advisor' })
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        setSelectedMember(null);
        fetchMembers(activeTab === 'all' ? '' : activeTab, filterDepartment, filterYear, searchTerm);
        fetchStats();
        alert('Application approved successfully!');
      } else {
        alert(data.message || 'Failed to approve');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (memberId, reason) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/members/status/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', advisorName: 'Advisor', rejectionReason: reason })
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        setSelectedMember(null);
        fetchMembers(activeTab === 'all' ? '' : activeTab, filterDepartment, filterYear, searchTerm);
        fetchStats();
        alert('Application rejected!');
      } else {
        alert(data.message || 'Failed to reject');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/members/${memberId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchMembers(activeTab === 'all' ? '' : activeTab, filterDepartment, filterYear, searchTerm);
        fetchStats();
        alert('Member deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  // ==========================================
  // EFFECTS
  // ==========================================

  useEffect(() => {
    // Load data on component mount (no login check)
    fetchMembers();
    fetchStats();
  }, []);

  useEffect(() => {
    // Fetch members when filters change
    fetchMembers(
      activeTab === 'all' ? '' : activeTab,
      filterDepartment,
      filterYear,
      searchTerm
    );
  }, [activeTab, filterDepartment, filterYear, searchTerm]);

  // ==========================================
  // RENDER: DASHBOARD (Direct - No Login)
  // ==========================================

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>📊 Membership Management</h1>
            <p>Manage student membership applications</p>
          </div>
        </div>
      </header>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Applications</p>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending Review</p>
            </div>
          </div>

          <div className="stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.approved}</h3>
              <p>Approved</p>
            </div>
          </div>

          <div className="stat-card rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <h3>{stats.rejected}</h3>
              <p>Rejected</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({stats?.pending || 0})
          </button>
          <button
            className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved ({stats?.approved || 0})
          </button>
          <button
            className={`tab ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected ({stats?.rejected || 0})
          </button>
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({stats?.total || 0})
          </button>
        </div>

        <div className="search-filters">
          <input
            type="text"
            placeholder="🔍 Search by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="filter-select"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {(searchTerm || filterDepartment || filterYear) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('');
                setFilterYear('');
              }}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Members Table */}
      <div className="members-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading applications...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No applications found</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="members-table">
            {members.map(member => (
              <div key={member.id} className={`member-card status-${member.status}`}>
                <div className="member-header">
                  <div className="member-info">
                    <h3>{member.fullName}</h3>
                    <p className="member-id">ID: {member.studentId}</p>
                  </div>
                  <span className={`status-badge ${member.status}`}>
                    {member.status.toUpperCase()}
                  </span>
                </div>

                <div className="member-details">
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{member.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{member.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{member.department}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Year:</span>
                    <span className="detail-value">{member.year}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Submitted:</span>
                    <span className="detail-value">
                      {new Date(member.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {member.reviewedAt && (
                    <div className="detail-item">
                      <span className="detail-label">Reviewed:</span>
                      <span className="detail-value">
                        {new Date(member.reviewedAt).toLocaleDateString()} by {member.reviewedBy}
                      </span>
                    </div>
                  )}
                </div>

                <div className="member-actions">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setShowModal(true);
                    }}
                    className="view-btn"
                  >
                    View Details
                  </button>

                  {member.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(member.id)}
                        className="approve-btn"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Rejection reason (optional):');
                          if (reason !== null) {
                            handleReject(member.id, reason);
                          }
                        }}
                        className="reject-btn"
                      >
                        ✗ Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(member.id)}
                    className="delete-btn"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Member Details */}
      {showModal && selectedMember && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>

            <h2>Application Details</h2>

            <div className="modal-details">
              <div className="modal-section">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> {selectedMember.fullName}</p>
                <p><strong>Email:</strong> {selectedMember.email}</p>
                <p><strong>Phone:</strong> {selectedMember.phone}</p>
                <p><strong>Student ID:</strong> {selectedMember.studentId}</p>
              </div>

              <div className="modal-section">
                <h3>Academic Information</h3>
                <p><strong>Department:</strong> {selectedMember.department}</p>
                <p><strong>Year:</strong> {selectedMember.year}</p>
              </div>

              <div className="modal-section">
                <h3>Application Reason</h3>
                <p className="reason-text">{selectedMember.reason}</p>
              </div>

              <div className="modal-section">
                <h3>Status</h3>
                <p>
                  <span className={`status-badge ${selectedMember.status}`}>
                    {selectedMember.status.toUpperCase()}
                  </span>
                </p>
                <p><strong>Submitted:</strong> {new Date(selectedMember.submittedAt).toLocaleString()}</p>
                {selectedMember.reviewedAt && (
                  <>
                    <p><strong>Reviewed:</strong> {new Date(selectedMember.reviewedAt).toLocaleString()}</p>
                    <p><strong>Reviewed By:</strong> {selectedMember.reviewedBy}</p>
                  </>
                )}
                {selectedMember.rejectionReason && (
                  <p><strong>Rejection Reason:</strong> {selectedMember.rejectionReason}</p>
                )}
              </div>
            </div>

            {selectedMember.status === 'pending' && (
              <div className="modal-actions">
                <button
                  onClick={() => handleApprove(selectedMember.id)}
                  className="approve-btn"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : '✓ Approve Application'}
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Rejection reason (optional):');
                    if (reason !== null) {
                      handleReject(selectedMember.id, reason);
                    }
                  }}
                  className="reject-btn"
                  disabled={actionLoading}
                >
                  ✗ Reject Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMembership;
