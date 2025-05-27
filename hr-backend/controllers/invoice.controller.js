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
