const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


// ------------------------------
// People
// ------------------------------

{/*app.get('/api/people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM people WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/}


app.post('/api/people', async (req, res) => {
  try {
    const { name, organisation, role, email, contact_number } = req.body;
    const result = await pool.query(
      `INSERT INTO people (name, organisation, role, email, contact_number)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, organisation, role, email, contact_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get
app.get('/api/people', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id,
              name,
              organisation,
              role,
              email,
              contact_number
       FROM people`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// EDIT (PUT) - Update a single person by ID
app.put('/api/people/:id',  async (req, res) => {
  try {
    const { id } = req.params;
    const { name, organisation, role, email, contact_number } = req.body;

    const result = await pool.query(
      `UPDATE people
       SET name = $1,
           organisation = $2,
           role = $3,
           email = $4,
           contact_number = $5
       WHERE id = $6
       RETURNING *`,
      [name, organisation, role, email, contact_number, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a single person by ID
app.delete('/api/people/:id',  async (req, res) => {
  try {
    const { id } = req.params;
    // Optional: first check if the record exists
    const findResult = await pool.query('SELECT * FROM people WHERE id = $1', [id]);
    if (findResult.rows.length === 0) {
      return res.status(404).json({ message: 'Person not found' });
    }

    await pool.query('DELETE FROM people WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ------------------------------
// Properties
// ------------------------------

app.get('/api/propertiies', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id,
              inquirer,
              city,
              address,
              property_type,
              building_rateable_value,
              rates_payable_before_relief,
              has_car_park,
              car_park_rateable_value,
              car_park_rates_payable_before_relief,
              total_rateable_value,
              total_rate_payable
       FROM propertiies`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/propertiies', async (req, res) => {
  try {
    const {
      inquirer,
      city,
      address,
      property_type,
      building_rateable_value,
      rates_payable_before_relief,
      has_car_park,
      car_park_rateable_value,
      car_park_rates_payable_before_relief,
      total_rateable_value,
      total_rate_payable
    } = req.body;

    const result = await pool.query(
      `INSERT INTO propertiies (
          inquirer,
          city,
          address,
          property_type,
          building_rateable_value,
          rates_payable_before_relief,
          has_car_park,
          car_park_rateable_value,
          car_park_rates_payable_before_relief,
          total_rateable_value,
          total_rate_payable
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        inquirer,
        city,
        address,
        property_type,
        building_rateable_value,
        rates_payable_before_relief,
        has_car_park,
        car_park_rateable_value,
        car_park_rates_payable_before_relief,
        total_rateable_value,
        total_rate_payable
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/propertiies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      inquirer,
      city,
      address,
      property_type,
      building_rateable_value,
      rates_payable_before_relief,
      has_car_park,
      car_park_rateable_value,
      car_park_rates_payable_before_relief,
      total_rateable_value,
      total_rate_payable
    } = req.body;

    const result = await pool.query(
      `UPDATE propertiies
       SET inquirer = $1,
           city = $2,
           address = $3,
           property_type = $4,
           building_rateable_value = $5,
           rates_payable_before_relief = $6,
           has_car_park = $7,
           car_park_rateable_value = $8,
           car_park_rates_payable_before_relief = $9,
           total_rateable_value = $10,
           total_rate_payable = $11
       WHERE id = $12
       RETURNING *`,
      [
        inquirer,
        city,
        address,
        property_type,
        building_rateable_value,
        rates_payable_before_relief,
        has_car_park,
        car_park_rateable_value,
        car_park_rates_payable_before_relief,
        total_rateable_value,
        total_rate_payable,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/propertiies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const findResult = await pool.query('SELECT * FROM propertiies WHERE id = $1', [id]);
    if (findResult.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await pool.query('DELETE FROM propertiies WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ------------------------------
// Person-Properties (the join table)
// ------------------------------

// GET: Retrieve all person-property relationships
{/*app.get('/api/person-properties',   async (req, res) => {
  try {
    // Optionally, you can join with persons and properties tables to get additional info:
    // const result = await pool.query(
    //   `SELECT pp.id, pp.is_related, p.name AS person_name, pr.address AS property_address
    //    FROM person_property pp
    //    JOIN persons p ON p.id = pp.person_id
    //    JOIN properties pr ON pr.id = pp.property_id`
    // );
    const result = await pool.query('SELECT * FROM person_property');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/}

app.get('/api/person_property', async (req, res) => {
  try {
    const query = `
      SELECT
        pp.id,
        pp.is_related,
        pp.person_id,
        pp.property_id,
        p.name as person_name,
        pr.address as property_address
      FROM person_property pp
      JOIN people p ON p.id = pp.person_id
      JOIN propertiies pr ON pr.id = pp.property_id
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST: Create a new person-property relationship
app.post('/api/person_property', async (req, res) => {
  try {
    const { personId, propertyId, isRelated } = req.body;
    const result = await pool.query(
      `INSERT INTO person_property (person_id, property_id, is_related)
       VALUES ($1, $2, $3) RETURNING *`,
      [personId, propertyId, isRelated]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update an existing person-property relationship
app.put('/api/person_property/:id',  async (req, res) => {
  try {
    const { id } = req.params;
    const { isRelated } = req.body;
    const result = await pool.query(
      `UPDATE person_property
       SET is_related = $1
       WHERE id = $2
       RETURNING *`,
      [isRelated, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a person-property relationship
app.delete('/api/person_property/:id',  async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM person_property WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
