{/*const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const pool = require('../db');

exports.createInvoice = async (req, res) => {
  const { html, person_id, property_id } = req.body;

  if (!html || !person_id || !property_id) {
    return res.status(400).json({ error: 'Missing data in request' });
  }

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    const invoiceId = `INV-${Date.now()}-${property_id}-${person_id}`;
    const saveDir = path.join(__dirname, '..', 'public', 'invoices');
    const savePath = path.join(saveDir, `${invoiceId}.pdf`);

    fs.mkdirSync(saveDir, { recursive: true });
    fs.writeFileSync(savePath, pdfBuffer);

    const result = await pool.query(`
      INSERT INTO invoices (invoice_id, person_id, property_id, file_path)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [invoiceId, person_id, property_id, `/invoices/${invoiceId}.pdf`]);

    res.status(200).json({ success: true, invoice: result.rows[0] });
  } catch (err) {
    console.error('Invoice generation error:', err);
    res.status(500).json({ error: 'Failed to generate invoice', details: err.message });
  }
};
*/}

{/*}
const generatePDF = require('../utils/generatePDFWithPuppeteer');

const createInvoiceHandler = async (req, res) => {
  const data = req.body;
  const fileName = `invoice-${Date.now()}.pdf`;

  try {
    await pool.query(
      `INSERT INTO invoice 
      (organisation_name, organisation_email, landlord_name, property_address, total_amount, pdf_filename) 
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [data.organisation_name, data.organisation_email, data.landlord_name, data.property_address, data.total_amount, fileName]
    );

    const filePath = await generatePDF(data, fileName);

    res.status(200).json({ message: 'Invoice saved and PDF generated', fileName, filePath });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
*/}
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
      invoice_no: generateInvoiceNo(),     // from your utils
      invoice_date: generateInvoiceDate(), // from your utils
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
};
