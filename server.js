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

// Routes
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
        console.log("🚀 Inserting agency:", { columns, values });
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

app.get('/therapists', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      therapist_id,
      first_name,
      last_name,
      role,
      home_location,
      mileage_rate
    FROM therapists
    ORDER BY last_name, first_name
  `);
  res.json(rows);
});

app.get('/therapist_rates', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      therapist_id,
      billing_area_id,
      visit_type_id,
      rate
    FROM therapist_rates
  `);
  res.json(rows);
});

app.post('/therapist_rates/upsert_many', async (req, res) => {
  const { rows } = req.body;

  const values = rows
    .map(
      (r, i) =>
        `($${i*4+1}, $${i*4+2}, $${i*4+3}, $${i*4+4})`
    )
    .join(',');

  const params = rows.flatMap(r => [
    r.therapist_id,
    r.billing_area_id,
    r.visit_type_id,
    r.rate,
  ]);

  await pool.query(`
    INSERT INTO therapist_rates
      (therapist_id, billing_area_id, visit_type_id, rate)
    VALUES ${values}
    ON CONFLICT (therapist_id, billing_area_id, visit_type_id)
    DO UPDATE SET rate = EXCLUDED.rate
  `, params);

  res.json({ success: true });
});

app.get('/billing_cities', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        city_name,
        billing_area_id,
        city_classification
      FROM billing_cities
      ORDER BY city_name
    `);

    res.json(rows);
  } catch (err) {
    console.error('billing_cities error:', err);
    res.status(500).json({ error: 'Failed to load billing cities' });
  }
});

app.get('/billing_areas', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        billing_area_id,
        area_name
      FROM billing_areas
      ORDER BY area_name
    `);

    res.json(rows);
  } catch (err) {
    console.error('billing_areas error:', err);
    res.status(500).json({ error: 'Failed to load billing areas' });
  }
});

app.get('/visit_types', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        visit_type_id,
        visit_code
      FROM visit_types
      ORDER BY visit_code
    `);

    res.json(rows);
  } catch (err) {
    console.error('visit_types error:', err);
    res.status(500).json({ error: 'Failed to load visit types' });
  }
});

app.post('/billing_cities', async (req, res) => {
  try {
    const { city_name, billing_area_id, city_classification } = req.body;

    if (!city_name || !billing_area_id || !city_classification) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await pool.query(
      `
      INSERT INTO billing_cities
        (city_name, billing_area_id, city_classification)
      VALUES ($1, $2, $3)
      ON CONFLICT (city_name)
      DO UPDATE SET
        billing_area_id = EXCLUDED.billing_area_id,
        city_classification = EXCLUDED.city_classification
      `,
      [city_name, billing_area_id, city_classification]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('billing_cities insert error:', err);
    res.status(500).json({ error: 'Failed to save billing city' });
  }
});

// Update therapist mileage rate
app.post('/therapists/update_mileage', async (req, res) => {
  const { therapist_id, mileage_rate } = req.body;

  if (!therapist_id || mileage_rate == null) {
    return res.status(400).json({
      error: 'therapist_id and mileage_rate are required',
    });
  }

  const rate = Number(mileage_rate);
  if (!Number.isFinite(rate)) {
    return res.status(400).json({
      error: 'mileage_rate must be a valid number',
    });
  }

  try {
    const result = await pool.query(
      `
      UPDATE therapists
      SET mileage_rate = $1
      WHERE therapist_id = $2
      RETURNING therapist_id, mileage_rate
      `,
      [rate, therapist_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Therapist not found',
      });
    }

    res.json({
      success: true,
      therapist: result.rows[0],
    });
  } catch (err) {
    console.error('update mileage rate error:', err);
    res.status(500).json({
      error: 'Failed to update mileage rate',
    });
  }
});

app.post('/therapists', async (req, res) => {
  const {
    first_name,
    last_name,
    role,
    home_location,
  } = req.body;

  if (!first_name || !last_name || !role || !home_location) {
    return res.status(400).json({
      error: 'first_name, last_name, role, and home_location are required',
    });
  }

  try {
    // Prevent duplicates (case-insensitive)
    const existing = await pool.query(
      `
      SELECT therapist_id
      FROM therapists
      WHERE LOWER(first_name) = LOWER($1)
        AND LOWER(last_name) = LOWER($2)
      `,
      [first_name.trim(), last_name.trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: 'Therapist already exists',
      });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO therapists (
        first_name,
        last_name,
        role,
        home_location,
        mileage_rate
      )
      VALUES ($1, $2, $3, $4, NULL)
      RETURNING *
      `,
      [
        first_name.trim(),
        last_name.trim(),
        role.trim(),
        home_location.trim(),
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('therapists insert error:', err);
    res.status(500).json({ error: 'Failed to create therapist' });
  }
});

// Batch update therapists (partial updates allowed)
app.post('/therapists/update_many', async (req, res) => {
  const { rows = [] } = req.body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'rows must be a non-empty array' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const r of rows) {
      const { therapist_id, ...fields } = r;

      if (!therapist_id) {
        throw new Error('therapist_id is required');
      }

      // Remove undefined fields
      const entries = Object.entries(fields)
        .filter(([, v]) => v !== undefined);

      if (entries.length === 0) continue;

      const columns = entries.map(([k]) => k);
      const values = entries.map(([, v]) => v);

      const setClause = columns
        .map((c, i) => `${c} = $${i + 1}`)
        .join(', ');

      await client.query(
        `
        UPDATE therapists
        SET ${setClause}
        WHERE therapist_id = $${columns.length + 1}
        `,
        [...values, therapist_id]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('update_many therapists error:', err);
    res.status(500).json({ error: 'Failed to update therapists' });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});