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
// Search people
// ------------------------------

// Search people by multiple fields like in propertiies
app.get('/api/people/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Missing search query parameter "q"' });
    }

    const result = await pool.query(
      `
      SELECT id, name, family
      FROM people
      WHERE 
        name ILIKE $1 OR 
        family ILIKE $1 
      `,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ------------------------------
// People
// ------------------------------

app.post('/api/people', async (req, res) => {
  try {
    const { name, organisation, role, email, contact_number,family,  
      property_address_for_enquiry, iqu_post_code_address, contact_county
       } = req.body;
    const result = await pool.query(
      `INSERT INTO people (name, organisation, role, email, contact_number, family, 
       property_address_for_enquiry  , iqu_post_code_address , contact_county
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, organisation, role, email, contact_number, family,
        property_address_for_enquiry, iqu_post_code_address, contact_county]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET distinct roles from the people table
app.get('/api/people/role', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT role
      FROM people
      WHERE role IS NOT NULL
      ORDER BY role
    `);
    // result.rows might look like [{role: 'Est Ag'}, {role: 'Landlord'}, ...]
    const roles = result.rows.map(row => row.role);
    res.json(roles); // => ["Est Ag", "Landlord", "Ass Man", ...]
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
              contact_number,
              family,          
              property_address_for_enquiry,
              iqu_post_code_address,
              contact_county
       FROM people`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one person by ID
app.get('/api/people/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid person id' });
  }

  try {
    const result = await pool.query(
      `SELECT 
         id,
         name,
         organisation,
         role,
         email,
         contact_number,
         family,          
         property_address_for_enquiry,
         iqu_post_code_address,
         contact_county
       FROM people
       WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EDIT (PUT) - Update a single person by ID
app.put('/api/people/:id',  async (req, res) => {
  try {
    const { id } = req.params;
    const { name, organisation, role, email, contact_number, family,
      property_address_for_enquiry, iqu_post_code_address, contact_county     
     } = req.body;

    const result = await pool.query(
      `UPDATE people
       SET name = $1,
           organisation = $2,
           role = $3,
           email = $4,
           contact_number = $5,
           family = $6,
           property_address_for_enquiry = $7,
           iqu_post_code_address = $8,
           contact_county = $9
       WHERE id = $10
       RETURNING *`,
      [name, organisation, role, email, contact_number,family,
        property_address_for_enquiry, iqu_post_code_address, contact_county,id]
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
// Search propertiies
// ------------------------------
// Search propertiies by city, property type or address
app.get('/api/propertiies/search', async (req, res) => {
  try {
    const { q, field } = req.query;

    if (!q || !field) {
      return res.status(400).json({ error: 'Missing "q" or "field" query parameter' });
    }
    const allowedFields = ['inquirer', 'address', 'post_code'];
    const fieldStr = String(field); // 🔒 Always treat field as a string
    if (!allowedFields.includes(fieldStr)) {
      return res.status(400).json({ error: 'Invalid search field' });
    }

    let result;

    if (fieldStr === "address") {
      // Search both address and post_code
      result = await pool.query(
        `SELECT id,
         inquirer,
         property_floor,
         property_first_line_address,
         property_second_line_address, 
         post_code 
        FROM propertiies 
        WHERE 
        property_floor ILIKE $1 OR
        property_first_line_address ILIKE $1 OR 
        property_second_line_address ILIKE $1 OR 
        post_code ILIKE $1`,
        [`%${q}%`]
      );
    } else {
      // Single-field search
      result = await pool.query(
        `SELECT id, inquirer,
                property_floor, 
                property_first_line_address, 
                property_second_line_address, 
                post_code 
        FROM propertiies 
        WHERE ${fieldStr} ILIKE $1`,
        [`%${q}%`]
      );
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ------------------------------
// Propertiies
// ------------------------------

// GET one property by ID
app.get('/api/propertiies/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid property id' })
  }
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
              total_rate_payable_before_relief   ,
              post_code,
              landlord_address,
              landlord_email,
              landlord_no, 
              rates_multiplier,
              start_date_of_lease,
              length_of_lease,
              end_date_of_lease,
              landlord_post_code_address,
              property_first_line_address,
              property_second_line_address,
              property_floor,
              property_solely_occupied,
              property_county,
              landlord_county,
              donation_due,
              total_rate_payable_after_relief,
              landlord_name,
              landlord_city

       FROM propertiies
       WHERE id = $1`,
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})


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
              total_rate_payable_before_relief,
              post_code,
              landlord_address,
              landlord_email,
              landlord_no, 
              rates_multiplier,
              start_date_of_lease,
              length_of_lease,
              end_date_of_lease,
              landlord_post_code_address,
              property_first_line_address,
              property_second_line_address,
              property_floor,
              property_solely_occupied,
              property_county, 
              landlord_county,    
              donation_due,   
              total_rate_payable_after_relief,  
              landlord_name,
              landlord_city
             
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
      total_rate_payable_before_relief,
      post_code,
      landlord_address,
      landlord_email,
      landlord_no, 
      rates_multiplier,
      start_date_of_lease,
      length_of_lease,
      end_date_of_lease,
      landlord_post_code_address,
      property_first_line_address,
      property_second_line_address,
      property_floor,
      property_solely_occupied,
      property_county, 
      landlord_county, 
      donation_due,
      total_rate_payable_after_relief,
      landlord_name,
      landlord_city,
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
          total_rate_payable_before_relief,
          post_code,
          landlord_address,
          landlord_email,
          landlord_no,
          rates_multiplier,
          start_date_of_lease,
          length_of_lease,
          end_date_of_lease,
          landlord_post_code_address,
          property_first_line_address,
          property_second_line_address,
          property_floor,
          property_solely_occupied,
          property_county, 
          landlord_county,
          donation_due,
          total_rate_payable_after_relief,
          landlord_name,
          landlord_city
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
       $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
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
        total_rate_payable_before_relief,
        post_code,
        landlord_address,
        landlord_email,
        landlord_no,
        rates_multiplier,
        start_date_of_lease,
        length_of_lease,
        end_date_of_lease,
        landlord_post_code_address,
        property_first_line_address,
        property_second_line_address,
        property_floor,
        property_solely_occupied,
        property_county, 
        landlord_county, 
        donation_due,
        total_rate_payable_after_relief, 
        landlord_name,
        landlord_city

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
      total_rate_payable_before_relief ,
      post_code,
      landlord_address,
      landlord_email,
      landlord_no,
      rates_multiplier,
      start_date_of_lease,
      length_of_lease,
      end_date_of_lease,
      landlord_post_code_address,
      property_first_line_address,
      property_second_line_address,
      property_floor,
      property_solely_occupied,
      property_county,  
      landlord_county, 
      donation_due,  
      total_rate_payable_after_relief, 
      landlord_name, 
      landlord_city
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
           total_rate_payable_before_relief = $11,  
           post_code = $12,
           landlord_address= $13,
           landlord_email = $14,
           landlord_no = $15,
           rates_multiplier = $16,
           start_date_of_lease = $17,
           length_of_lease = $18,
           end_date_of_lease = $19,   
           landlord_post_code_address=$20,   
           property_first_line_address=$21,
           property_second_line_address=$22,
           property_floor=$23,
           property_solely_occupied = $24, 
           property_county = $25,
           landlord_county = $26 ,
           donation_due = $27,
           total_rate_payable_after_relief = $28,
           landlord_name = $29,
           landlord_city = $30
       WHERE id = $31
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
        total_rate_payable_before_relief,
        post_code,
        landlord_address,
        landlord_email,
        landlord_no,
        rates_multiplier,
        start_date_of_lease,
        length_of_lease,
        end_date_of_lease,
        landlord_post_code_address,
        property_first_line_address,
        property_second_line_address,
        property_floor,
        property_solely_occupied,
        property_county,
        landlord_county, 
        donation_due,
        total_rate_payable_after_relief ,
        landlord_name,
        landlord_city,
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


// GET distinct roles from the people table
app.get('/api/propertiies/property_type', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT property_type
      FROM propertiies
      WHERE property_type IS NOT NULL
      ORDER BY property_type
    `);
    // result.rows might look like ['Office' | 'Retail' | 'Warehouse' ]
    const property_types = result.rows.map(row => row.property_type);
    res.json(property_types); // => ['Office' | 'Retail' | 'Warehouse' ]
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------
// Person-Properties (the join table)
// ------------------------------

// GET: Retrieve all person-property relationships
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

// ------------------------------
// Proposals
// ------------------------------


app.post('/api/proposals', async (req, res) => {
  try {
    const { personId, propertyId, proposalData } = req.body; 
    // proposalData could be { price: 1000, terms: "...", etc. }

    const result = await pool.query(
      `INSERT INTO proposals (person_id, property_id, proposal_data)
       VALUES ($1, $2, $3)
       RETURNING *`,
       [personId, propertyId, proposalData]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});


{/*
app.post('/api/proposals', async (req, res) => {
  const { personId, propertyId, proposalData: clientData } = req.body;
  try {
    // 1) Fetch property & person records
    const propRes   = await pool.query(
      'SELECT landlord_name, landlord_address, landlord_county, property_first_line_address  FROM propertiies WHERE id = $1',
      [propertyId]
    );
    const personRes = await pool.query(
      'SELECT  name ,property_address_for_enquiry, contact_county FROM people WHERE id = $1',
      [personId]
    );

    if (!propRes.rows.length || !personRes.rows.length) {
      return res.status(400).json({ error: 'Invalid personId or propertyId' });
    }

    const prop   = propRes.rows[0];
    const person = personRes.rows[0];

    // 2) Choose landlord fields, falling back to the person
    const propertyAddress = prop.property_first_line_address;
    const RecipiantName = prop.landlord_name || person.name;
    const RecipiantAddress = prop.landlord_address
      ? `${prop.landlord_address}, ${prop.landlord_county}`
      : person.property_address_for_enquiry;


     // 3) Merge into a single proposal_data object    
    const replacedBody = clientData.body
      .replace('[RECIPIANT_NAME]', RecipiantName)
      .replace('[PROPERTY_ADDRESS]', propertyAddress);
      
    const fullProposalData = {
      date: clientData.date,
      RecipiantName,
      RecipiantAddress,
      propertyAddress,
      body: replacedBody
    };


    // 4) Insert & return
    const result = await pool.query(
      `INSERT INTO proposals
         (person_id, property_id, proposal_data)
       VALUES
         ($1,        $2,          $3)
       RETURNING *`,
      [personId, propertyId, fullProposalData]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

*/}
// GET: Retrieve a single proposal (with joined person & property info)
app.get('/api/proposals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT
        p.id,
        p.status,
        p.proposal_data,
        p.created_at,
        p.updated_at,
        per.id    AS person_id,
        per.name  AS person_name,
        pr.id     AS property_id,
        pr.address AS property_address
      FROM proposals p
      JOIN people per     ON per.id = p.person_id
      JOIN propertiies pr   ON pr.id  = p.property_id
      WHERE p.id = $1
      `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

// GET: Retrieve all proposals
app.get('/api/proposals', async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.id,
        p.status,
        p.proposal_data,
        p.created_at,
        p.updated_at,
        pe.id    AS person_id,
        pe.name  AS person_name,
        pr.id    AS property_id,
        pr.address AS property_address
      FROM proposals p
      JOIN people pe      ON pe.id = p.person_id
      JOIN propertiies pr ON pr.id = p.property_id
      ORDER BY p.created_at DESC
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});


// PUT: Update an existing proposal
app.put('/api/proposals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { personId, propertyId, proposalData, status } = req.body;
    const result = await pool.query(
      `
      UPDATE proposals
      SET
        person_id     = COALESCE($1, person_id),
        property_id   = COALESCE($2, property_id),
        proposal_data = COALESCE($3, proposal_data),
        status        = COALESCE($4, status),
        updated_at    = NOW()
      WHERE id = $5
      RETURNING *
      `,
      [personId, propertyId, proposalData, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update proposal' });
  }
});

// DELETE: Remove a proposal
app.delete('/api/proposals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM proposals WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete proposal' });
  }
});


// GET /api/proposals/latest?personId=2&propertyId=3
app.get('/api/proposals/latest', async (req, res) => {
  const { personId, propertyId } = req.query;

  if (!personId || !propertyId) {
    return res.status(400).json({ error: 'Missing personId or propertyId' });
  }

  try {
    const result = await pool.query(
      `SELECT id, status, created_at FROM proposals
       WHERE person_id = $1 AND property_id = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [personId, propertyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No proposal found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});





// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
