// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set up PostgreSQL connection to Timescale Cloud
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Routes
app.post('/cities', async (req, res) => {
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

app.get('/cities', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cities');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Failed to fetch cities' });
    }
});

app.get('/agencydata', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM agencydata');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching agency data:', error);
        res.status(500).json({ error: 'Failed to fetch agency data' });
    }
});

// GET current invoice number
app.get('/invoicenumber', async (req, res) => {
  const result = await pool.query('SELECT current_invoice_number FROM invoicecounter WHERE id = 1');
  res.json({ invoiceNumber: result.rows[0].current_invoice_number });
});

// POST update invoice number
app.post('/invoicenumber', async (req, res) => {
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