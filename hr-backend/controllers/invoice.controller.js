// controllers/invoice.controller.js

const fs = require('fs');
const path = require('path');
const generateInvoiceHTML = require('../utils/generateInvoiceHTML');
const generatePDF = require('../utils/generatePDFWithPuppeteer');
const { generateInvoiceNo, generateInvoiceDate, generateRemitDate, getNextInvoiceNo } = require('../utils/invoiceUtils');
const pool = require('../db'); // adjust path if needed

exports.createInvoice = async (req, res) => {
  try {
    // 1. Gather invoice data from request
    const invoiceData = {
      ...req.body,
      invoice_no: await getNextInvoiceNo(req.body.country), // Async!
      invoice_date: generateInvoiceDate(),
      remit_date: generateRemitDate()
    };

    // 2. Set the absolute path for the PNG background (for PDF)
    const rawPath = path.resolve(__dirname, '../public/templates/invoiceTemplate.png');
    const base64Png = fs.readFileSync(rawPath).toString('base64');
    invoiceData.bg_absolute_path = `data:image/png;base64,${base64Png}`;

    // 3. Generate the HTML for the invoice
    const html = generateInvoiceHTML(invoiceData);

    // 4. Generate PDF and path
    const invoiceIdentifier = String(invoiceData.invoice_no).replace(/[^\w\-]/g, '-'); 
    const outputDir = path.resolve(__dirname, '../public/invoices');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    //const fileName = `Rnc-${Date.now()}.pdf`;
    const fileName = `INV-${invoiceIdentifier}.pdf`;
    const outputPath = path.join(outputDir, fileName);

    
    // 5. Render PDF
    await generatePDF(html, outputPath);

    // 6. Save invoice info to database (adjust column names as needed!)
    await pool.query(
      `INSERT INTO invoice 
      (landlord_name, property_address, total_amount, pdf_filename, invoice_no, remit_date, invoice_date, is_paid, property_id, country) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )`,
      [
        invoiceData.landlord_name,
        invoiceData.property_address,
        invoiceData.total,
        fileName, // or outputPath if you want the path
        invoiceData.invoice_no,
        invoiceData.remit_date,
        invoiceData.invoice_date,
        false,
        invoiceData.property_id,
        invoiceData.country,
      ]
    );

    // 7. Respond with PDF file info
    res.json({ filePath: `/public/invoices/${fileName}`, fileName });
  } catch (err) {
    console.error('Error generating invoice:', err);
    res.status(500).json({ error: 'Failed to generate invoice.' });
  }
};






   

{/*
const fs = require('fs');

const path = require('path');
const bgAbsolutePath = path.resolve(__dirname, '../public/templates/invoiceTemplate.png');
const generateInvoiceHTML = require('../utils/generateInvoiceHTML');
const generatePDF = require('../utils/generatePDFWithPuppeteer');
const { generateInvoiceNo, generateInvoiceDate, generateRemitDate } = require('../utils/invoiceUtils');


exports.createInvoice = async (req, res) => {
  try {
    // 1. Gather invoice data from request
    const invoiceData = {
      ...req.body,
     // invoice_no: generateInvoiceNo(),     // from your utils
      //invoice_date: generateInvoiceDate(), // from your utils
      remit_date :generateRemitDate()
    };
    

    // 2. Set the absolute path for the PNG
    const rawPath = path.resolve(__dirname, '../public/templates/invoiceTemplate.png');
    const base64Png = fs.readFileSync(rawPath).toString('base64');
    invoiceData.bg_absolute_path = `data:image/png;base64,${base64Png}`;


       // 3. Generate the HTML with data
    const html = generateInvoiceHTML(invoiceData);


    // 4. Generate PDF path (invoices/INV-xxx.pdf)
    const outputDir = path.resolve(__dirname, '../public/invoices');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const fileName = `INV-${Date.now()}.pdf`;
    const outputPath = path.join(outputDir, fileName);

    // 5. Render PDF
    await generatePDF(html, outputPath);

    // 6. Respond with the file path (or send/download/email)
    res.json({ filePath: `/public/invoices/${fileName}`, fileName });
  } catch (err) {
    console.error('Error generating invoice:', err);
    res.status(500).json({ error: 'Failed to generate invoice.' });
  }
};*/}



