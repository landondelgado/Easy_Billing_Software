// server.js
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Set up PostgreSQL connection to Timescale Cloud
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware to verify token and check against DB
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    const result = await pool.query('SELECT * FROM authorized_users WHERE email = $1', [email]);
    if (result.rowCount === 0) return res.status(403).json({ error: 'User not authorized' });

    req.user = { email };
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/agencydata', authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows = [], deletedIds = [] } = req.body;

    await client.query('BEGIN');

    // Step 1: Delete removed rows
    if (deletedIds.length > 0) {
      const placeholders = deletedIds.map((_, i) => `$${i + 1}`).join(', ');
      await client.query(`DELETE FROM agencydata WHERE id IN (${placeholders})`, deletedIds);
      console.log('🗑️ Deleted IDs:', deletedIds);
    }

    // Step 2: Insert or update remaining rows
    for (const row of rows) {
      const { id, ...fields } = row;
      const columns = Object.keys(fields);
      const values = Object.values(fields);

      if (!id) {
        const placeholders = columns.map((_, i) => `$${i + 1}`);
        const query = `INSERT INTO agencydata (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
        await client.query(query, values);
      } else {
        const setClauses = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
        const query = `UPDATE agencydata SET ${setClauses} WHERE id = $${columns.length + 1}`;
        await client.query(query, [...values, id]);
      }
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Changes saved' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Save failed:', err.message);
    res.status(500).json({ error: 'Save failed' });
  } finally {
    client.release();
  }
});

// Routes
app.post('/api/auth/google', async (req, res) => {
    const { credential } = req.body;

    try {
        const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email.trim().toLowerCase()

        const allowed = await pool.query('SELECT 1 FROM authorized_users WHERE email = $1', [email]);
        if (allowed.rowCount === 0) {
        return res.status(403).json({ error: 'Unauthorized user' });
        }

        return res.status(200).json({
            authorized: true,
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
        });
    } catch (err) {
        console.error('Token verification error', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
});

app.post('/cities', authenticate, async (req, res) => {
    const { name, intown, oot, extended } = req.body;
    try {
        await pool.query(
            'INSERT INTO cities (name, intown, outtown, extended) VALUES ($1, $2, $3, $4)',
            [name, intown, oot, extended]
        );
        res.status(201).json({ message: 'City added' });
    } catch (error) {
        console.error('Error adding city:', error);
        res.status(500).json({ error: 'Failed to add city' });
    }
});

app.get('/cities', authenticate, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cities');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Failed to fetch cities' });
    }
});

app.get('/agencydata', authenticate, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM agencydata');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching agency data:', error);
        res.status(500).json({ error: 'Failed to fetch agency data' });
    }
});

// GET current invoice number
app.get('/invoicenumber', authenticate, async (req, res) => {
  const result = await pool.query('SELECT current_invoice_number FROM invoicecounter WHERE id = 1');
  res.json({ invoiceNumber: result.rows[0].current_invoice_number });
});

// POST update invoice number
app.post('/invoicenumber', authenticate, async (req, res) => {
    const { invoiceNumber } = req.body;
    if (typeof invoiceNumber !== 'number') {
        return res.status(400).json({ error: 'invoiceNumber must be a number' });
    }

    try {
        await pool.query('UPDATE invoicecounter SET current_invoice_number = $1 WHERE id = 1', [invoiceNumber]);
        res.json({ message: 'Invoice number updated' });
    } catch (error) {
        console.error('Error updating invoice number:', error);
        res.status(500).json({ error: 'Failed to update invoice number' });
    }
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'billingsoftware/build')));
    app.get('*name', (req, res) => {
        res.sendFile(path.join(__dirname, 'billingsoftware/build/index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});