router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const normalizedEmail = email.toLowerCase();

  try {

    db.query('SELECT * FROM users WHERE email = ?', [normalizedEmail], async (err, results) => {
      if (err) {
        console.error("MySQL SELECT error:", err);
        return res.status(500).json({ message: 'Database error (SELECT)' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, normalizedEmail, hashedPassword, role],
        (err, result) => {

          if (err) {
            console.error("MySQL INSERT error:", err);
            return res.status(500).json({ message: 'Database error (INSERT)' });
          }

          res.status(201).json({ message: 'User registered successfully' });

        }
      );
    });

  } catch (error) {
    console.error("SERVER CATCH ERROR:", error);
    res.status(500).json({ message: 'Server error' });
  }
});