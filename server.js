require('dotenv').config();
const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Create MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Connect to Database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL Database!');
});

// 1️⃣ Create a New User (INSERT)
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  
  db.query(query, [name, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  });
});

app.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching users:', err); // Log error
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

// 3️⃣ Update a User by ID (UPDATE)
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';

  db.query(query, [name, email, password, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated successfully' });
  });
});

// 4️⃣ Delete a User by ID (DELETE)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted successfully' });
  });
});

app.listen(PORT,  () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
  