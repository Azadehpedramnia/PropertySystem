// hr-backend/services/invoiceService.js

const pool = require('../db'); // your db.js exports the pool
const { generateInvoiceNo } = require('../utils/invoiceUtils');



async function getNextInvoiceNo(country) {
  const prefix = (country.trim().toUpperCase().slice(0,2) + 'O');
  const searchPrefix = prefix + '-';
  const result = await pool.query(
    `SELECT invoice_no FROM invoice WHERE invoice_no LIKE $1 ORDER BY id DESC LIMIT 1`,
    [`${searchPrefix}%`]
  );
  let lastNumber = 508;
  if (result.rows.length) {
    const lastInvoiceNo = result.rows[0].invoice_no;
    const numPart = parseInt(lastInvoiceNo.split('-')[1]);
    if (!isNaN(numPart)) lastNumber = numPart;
  }
  return generateInvoiceNo(country, lastNumber);
}

module.exports = { getNextInvoiceNo };