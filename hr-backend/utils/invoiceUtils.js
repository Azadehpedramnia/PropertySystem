// utils/invoiceUtils.js
const pool = require('../db');


// Gets first two letters of country, uppercase, plus 'O' (e.g. "SCO")
function getInvoicePrefix(country) {
  if (!country) return 'XXO'; // fallback if country is missing
  return country.trim().toUpperCase().slice(0,2) + 'O';
}

// Example function to generate the new invoice number
// previousNumber is last used (e.g., 508)
function generateInvoiceNo(country, previousNumber) {
  const prefix = getInvoicePrefix(country);
  const newNumber = (Number(previousNumber) || 508) + 1; // if none, start at 509
  return `${prefix}-${newNumber}`;
}


// Format today's date in "06 June 2025" style
function generateInvoiceDate() {
  const now = new Date();
  return now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

// Add this to utils/invoiceUtils.js

function generateRemitDate() {
  const now = new Date();
  now.setDate(now.getDate() + 14); // 14 days after today
  // Format as "27th January 2025"
  return now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}


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

module.exports = { 
  generateInvoiceNo, 
  generateInvoiceDate,
  generateRemitDate,  
  getNextInvoiceNo,    
};
