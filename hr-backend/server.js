const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// JWT secret from .env
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify JWT token and attach user data to request
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // The token is expected in the format "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // user object: { id, email, role }
    next();
  });
}
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Middleware to check if user is an Admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
}

// ---------------------
// Authentication Routes
// ---------------------

// POST /api/auth/login – Authenticate user and return JWT token
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = result.rows[0];

    // Compare the provided password with the hashed password in DB
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create and return a JWT token (expires in 1 hour)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------
// Enquiries Management Routes (Admin Only)
// ---------------------

// GET /api/enquiries – List all employees
app.get('/api/enquiries', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM enquiring_person ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/enquiries – Add a new employee
app.post('/api/enquiries', authenticateToken, isAdmin, async (req, res) => {
  const {   
    city,
    full_address,
    enquirer_name,
    organisation,
    role,
    current_position,
    property_enquiry_address,
    email,
    total_rateable_value,
    contact_number,
    estate_agent_name,
    estate_agent_contact_number,
    estate_agent_email,
    property_type,
    landlord_name,
    landlord_email,
    landlord_phone,
    rateable_value_info,
    has_management_company,
    poc_email,
    poc_contact_number,
    has_car_park,
    car_park_rateable_value } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO enquiring_person (
        city, full_address, enquirer_name, organisation, role,
        current_position, property_enquiry_address, email,
        total_rateable_value, contact_number, estate_agent_name,
        estate_agent_contact_number, estate_agent_email, property_type,
        landlord_name, landlord_email, landlord_phone,
        rateable_value_info, has_management_company, poc_email,
        poc_contact_number, has_car_park, car_park_rateable_value
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8,
        $9, $10, $11,
        $12, $13, $14,
        $15, $16, $17,
        $18, $19, $20,
        $21, $22, $23
      ) RETURNING *`,
      [
        city, full_address, enquirer_name, organisation, role,
        current_position, property_enquiry_address, email,
        total_rateable_value, contact_number, estate_agent_name,
        estate_agent_contact_number, estate_agent_email, property_type,
        landlord_name, landlord_email, landlord_phone,
        rateable_value_info, has_management_company, poc_email,
        poc_contact_number, has_car_park, car_park_rateable_value
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/enquiries/:id – Edit employee details
app.put('/api/enquiries/:id', authenticateToken, isAdmin, async (req, res) => {
  const id = req.params.id;
  const {   
    city,
    full_address,
    enquirer_name,
    organisation,
    role,
    current_position,
    property_enquiry_address,
    email,
    total_rateable_value,
    contact_number,
    estate_agent_name,
    estate_agent_contact_number,
    estate_agent_email,
    property_type,
    landlord_name,
    landlord_email,
    landlord_phone,
    rateable_value_info,
    has_management_company,
    poc_email,
    poc_contact_number,
    has_car_park,
    car_park_rateable_value } = req.body;

  try {
    const result = await pool.query(
     `UPDATE enquiring_person SET
        city = $1, full_address = $2, enquirer_name = $3, organisation = $4, role = $5,
        current_position = $6, property_enquiry_address = $7, email = $8,
        total_rateable_value = $9, contact_number = $10, estate_agent_name = $11,
        estate_agent_contact_number = $12, estate_agent_email = $13, property_type = $14,
        landlord_name = $15, landlord_email = $16, landlord_phone = $17,
        rateable_value_info = $18, has_management_company = $19, poc_email = $20,
        poc_contact_number = $21, has_car_park = $22, car_park_rateable_value = $23
      WHERE id = $24 RETURNING *`,
      [
        city, full_address, enquirer_name, organisation, role,
        current_position, property_enquiry_address, email,
        total_rateable_value, contact_number, estate_agent_name,
        estate_agent_contact_number, estate_agent_email, property_type,
        landlord_name, landlord_email, landlord_phone,
        rateable_value_info, has_management_company, poc_email,
        poc_contact_number, has_car_park, car_park_rateable_value,
        id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/enquiries/:id – Delete an employee
app.delete('/api/enquiries/:id', authenticateToken, isAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM enquiring_person WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'enquiries person not found' });
    }
    res.json({ message: 'enquiring person deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
