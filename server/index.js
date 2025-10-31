import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: [
    'http://localhost:8080', // Vite dev server (configured in vite.config.ts)
    'http://127.0.0.1:8080'
  ],
  credentials: false,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'Lock In API' });
});

// USERS
app.get('/users', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT UserID, Name, Email FROM User');
    res.json(rows);
  } catch (err) {
    console.error('GET /users error', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/add_user', async (req, res) => {
  try {
    const { Name, Email, Password } = req.body;
    if (!Name || !Email || !Password) {
      return res.status(400).json({ error: 'Name, Email and Password are required' });
    }
    const passwordHash = await bcrypt.hash(Password, 10);
    const [result] = await pool.query(
      'INSERT INTO User (Name, Email, Password) VALUES (?, ?, ?)',
      [Name, Email, passwordHash]
    );
    res.json({ UserID: result.insertId, Name, Email });
  } catch (err) {
    console.error('POST /add_user error', err);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// GOALS
app.get('/goals', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const [rows] = await pool.query(
      'SELECT GoalID, Title, Description, DueDate, UserID FROM Goal WHERE UserID = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /goals error', err);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

app.post('/goals', async (req, res) => {
  try {
    const { Title, Description = '', DueDate, UserID } = req.body;
    if (!Title || !DueDate || !UserID) {
      return res.status(400).json({ error: 'Title, DueDate and UserID are required' });
    }
    const [result] = await pool.query(
      'INSERT INTO Goal (Title, Description, DueDate, UserID) VALUES (?, ?, ?, ?)',
      [Title, Description, new Date(DueDate), UserID]
    );
    res.json({ GoalID: result.insertId, Title, Description, DueDate, UserID });
  } catch (err) {
    console.error('POST /goals error', err);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

app.delete('/goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Goal WHERE GoalID = ?', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /goals/:id error', err);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

app.listen(PORT, () => {
  console.log(`Lock In API listening on http://localhost:${PORT}`);
});
