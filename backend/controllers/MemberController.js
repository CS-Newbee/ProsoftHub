import { db } from '../server.js';

// ==========================================
// STUDENT - Submit Membership Application
// ==========================================
export const addMember = (req, res) => {
  const { fullName, email, phone, studentId, department, year, reason } = req.body;

  // Validation
  if (!fullName || !email || !phone || !studentId || !department || !year || !reason) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Check if student already applied
  const checkQuery = 'SELECT * FROM members WHERE email = ? OR studentId = ?';
  
  db.query(checkQuery, [email, studentId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application'
      });
    }

    // Insert new membership application
    const insertQuery = `
      INSERT INTO members 
      (fullName, email, phone, studentId, department, year, reason, status, submittedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    db.query(
      insertQuery,
      [fullName, email, phone, studentId, department, year, reason],
      (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to submit application'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Application submitted successfully! Waiting for advisor approval.',
          data: {
            id: result.insertId,
            status: 'pending'
          }
        });
      }
    );
  });
};

// ==========================================
// STUDENT - Check Application Status
// ==========================================
export const checkApplicationStatus = (req, res) => {
  const { email, studentId } = req.query;

  if (!email && !studentId) {
    return res.status(400).json({
      success: false,
      message: 'Email or Student ID is required'
    });
  }

  let query = 'SELECT id, fullName, email, studentId, status, submittedAt, reviewedAt, rejectionReason FROM members WHERE ';
  const params = [];

  if (email) {
    query += 'email = ?';
    params.push(email);
  } else {
    query += 'studentId = ?';
    params.push(studentId);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No application found'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
};

// ==========================================
// ADVISOR - Get All Member Applications
// ==========================================
export const getAllMembers = (req, res) => {
  const { status, department, year, search } = req.query;

  let query = 'SELECT * FROM members WHERE 1=1';
  const params = [];

  // Filter by status
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  // Filter by department
  if (department) {
    query += ' AND department = ?';
    params.push(department);
  }

  // Filter by year
  if (year) {
    query += ' AND year = ?';
    params.push(year);
  }

  // Search by name, email, or studentId
  if (search) {
    query += ' AND (fullName LIKE ? OR email LIKE ? OR studentId LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY submittedAt DESC';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch members'
      });
    }

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  });
};

// ==========================================
// ADVISOR - Update Member Status (Approve/Reject)
// ==========================================
export const updateMemberStatus = (req, res) => {
  const { id } = req.params;
  const { status, advisorName, rejectionReason } = req.body;

  // Validate status
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be: approved, rejected, or pending'
    });
  }

  // Check if member exists
  const checkQuery = 'SELECT * FROM members WHERE id = ?';
  
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const member = results[0];

    // Check if already reviewed
    if (member.status !== 'pending' && status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This application has already been ${member.status}`
      });
    }

    // Update member status
    let updateQuery = `
      UPDATE members 
      SET status = ?, 
          reviewedAt = NOW(), 
          reviewedBy = ?
    `;
    
    const params = [status, advisorName || 'Advisor'];

    // Add rejection reason if rejected
    if (status === 'rejected' && rejectionReason) {
      updateQuery += ', rejectionReason = ?';
      params.push(rejectionReason);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    db.query(updateQuery, params, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to update status'
        });
      }

      res.json({
        success: true,
        message: `Application ${status} successfully`,
        data: {
          id: parseInt(id),
          status,
          reviewedBy: advisorName || 'Advisor'
        }
      });
    });
  });
};

// ==========================================
// ADVISOR - Delete Member
// ==========================================
export const deleteMember = (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM members WHERE id = ?';

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete member'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  });
};

// ==========================================
// ADVISOR - Get Statistics
// ==========================================
export const getMemberStats = (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
    FROM members
  `;

  const departmentQuery = `
    SELECT department, COUNT(*) as count 
    FROM members 
    GROUP BY department
  `;

  const yearQuery = `
    SELECT year, COUNT(*) as count 
    FROM members 
    GROUP BY year
  `;

  // Execute all queries
  db.query(statsQuery, (err, statsResults) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }

    db.query(departmentQuery, (err, deptResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch statistics'
        });
      }

      db.query(yearQuery, (err, yearResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
          });
        }

        // Format statistics
        const stats = statsResults[0];
        const byDepartment = {};
        const byYear = {};

        deptResults.forEach(row => {
          byDepartment[row.department] = row.count;
        });

        yearResults.forEach(row => {
          byYear[row.year] = row.count;
        });

        res.json({
          success: true,
          data: {
            total: stats.total,
            pending: stats.pending,
            approved: stats.approved,
            rejected: stats.rejected,
            byDepartment,
            byYear
          }
        });
      });
    });
  });
};