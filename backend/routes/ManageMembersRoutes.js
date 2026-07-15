import express from 'express';
import { db } from '../server.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ==========================================
// ADVISOR LOGIN
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Query advisor from database
    const query = 'SELECT * FROM advisors WHERE username = ?';
    
    db.query(query, [username], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Server error'
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      const advisor = results[0];

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, advisor.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: advisor.id, 
          username: advisor.username,
          role: 'advisor'
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: advisor.id,
          username: advisor.username,
          name: advisor.name,
          email: advisor.email
        }
      });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ==========================================
// ADVISOR REGISTRATION (Optional - for creating new advisors)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    if (!username || !password || !name || !email) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if username already exists
    const checkQuery = 'SELECT * FROM advisors WHERE username = ? OR email = ?';
    
    db.query(checkQuery, [username, email], async (err, results) => {
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
          message: 'Username or email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new advisor
      const insertQuery = `
        INSERT INTO advisors (username, password, name, email, createdAt) 
        VALUES (?, ?, ?, ?, NOW())
      `;

      db.query(insertQuery, [username, hashedPassword, name, email], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to create advisor account'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Advisor account created successfully',
          data: {
            id: result.insertId,
            username,
            name,
            email
          }
        });
      });
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ==========================================
// VERIFY TOKEN (Middleware)
// ==========================================
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// ==========================================
// GET CURRENT USER
// ==========================================
router.get('/me', verifyToken, (req, res) => {
  const query = 'SELECT id, username, name, email FROM advisors WHERE id = ?';
  
  db.query(query, [req.user.id], (err, results) => {
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
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

export default router;