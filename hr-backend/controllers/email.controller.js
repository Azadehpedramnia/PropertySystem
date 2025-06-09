const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const pool = require('../db');

//for testcd
const stubTransport = require('nodemailer-stub-transport');

const transporter = nodemailer.createTransport(stubTransport());

//for real email need secret code in .env 
{/*

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // TLS, not SSL
  auth: {
    user: process.env.EMAIL_USER, // finance@humanitarianoperations.org
    pass: process.env.EMAIL_PASS
  }
});

*/}

exports.emailInvoicesForOrganisation = async (req, res) => {
  const { organisation } = req.body;

  try {
    // 1. Query all relevant invoices for this organisation
    const result = await pool.query(`
      SELECT i.pdf_filename, p.organisation_email
      FROM invoice i
      JOIN person_property pp ON i.property_id = pp.property_id
      JOIN people p ON p.id = pp.person_id
      WHERE p.organisation = $1
    `, [organisation]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No invoices found.' });
    }

    const organisationEmail = result.rows[0].organisation_email;
    const attachments = result.rows.map(row => {
      const filePath = path.join(__dirname, '../public/invoices', row.pdf_filename);
      return {
        filename: row.pdf_filename,
        path: filePath
      };
    });

    // 2. Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: organisationEmail,
      subject: `Invoices for Organisation: ${organisation}`,
      text: `Please find attached all invoices for your organisation.`,
      attachments
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Invoices emailed successfully.' });

  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send invoices." });
  }
};
