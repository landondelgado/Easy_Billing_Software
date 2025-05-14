// server.js
const express = require('express');
const cors = require('cors');
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

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});