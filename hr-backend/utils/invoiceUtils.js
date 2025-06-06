// utils/invoiceUtils.js

// Generate a unique invoice number (example: SC20240606001)
function generateInvoiceNo() {
  const now = new Date();
  // Example: SC + YYYYMMDD + random 3-digit
  return 'SC' +
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(Math.floor(Math.random() * 1000)).padStart(3, '0');
}

// Format today's date in "06 June 2025" style
function generateInvoiceDate() {
  const now = new Date();
  return now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

module.exports = { generateInvoiceNo, generateInvoiceDate };
