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


//-------------------
//Invoice Number
//-------------------

async function getNextInvoiceNo(country) {
  const prefix = getInvoicePrefix(country);
  let lastNumber = 508;

  const result = await pool.query(
    `SELECT invoice_no FROM invoice ORDER BY id DESC LIMIT 1`
  );

  if (result.rows.length) {
    const lastInvoiceNo = result.rows[0].invoice_no;
    const numPart = parseInt(lastInvoiceNo.split('-')[1]);
    if (!isNaN(numPart)) lastNumber = numPart;
  }

  return `${prefix}-${lastNumber + 1}`;
}


//-------------------
//Invoice Date
//-------------------

async function getNextInvoiceDate(propertyId) {
  if (!propertyId) throw new Error("propertyId is required");

  // Step 1: Check for the latest invoice date for this property
  const result = await pool.query(
    `SELECT invoice_date FROM invoice WHERE property_id = $1 ORDER BY id DESC LIMIT 1`,
    [propertyId]
  );

  let baseDate;

  if (result.rows.length === 0) {
    // Step 2: No invoice exists → use start_date_of_lease
    const leaseResult = await pool.query(
      `SELECT start_date_of_lease FROM propertiies WHERE id = $1`,
      [propertyId]
    );

    if (!leaseResult.rows.length) throw new Error("Property not found");

    baseDate = new Date(leaseResult.rows[0].start_date_of_lease);
  } else {
    // Step 3: Invoices exist → get next month's first day
    const lastInvoiceDate = new Date(result.rows[0].invoice_date);
    baseDate = new Date(lastInvoiceDate.getFullYear(), lastInvoiceDate.getMonth() + 1, 1); // first day of next month
  }

  // Step 4: Format date as "01 July 2025"
  return baseDate.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}


//-------------------
//Remit Date
//-------------------

function generateRemitDate(invoiceDateStr) {
  if (!invoiceDateStr) throw new Error("invoiceDate is required");

  const invoiceDate = new Date(invoiceDateStr);
  const remitDate = new Date(invoiceDate.getFullYear(), invoiceDate.getMonth(), 27);

  // Format as "27 June 2025"
  return remitDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}



module.exports = { 
  generateInvoiceNo, 
  //generateInvoiceDate,
  generateRemitDate,  
  getNextInvoiceNo,    
  getNextInvoiceDate,
};
