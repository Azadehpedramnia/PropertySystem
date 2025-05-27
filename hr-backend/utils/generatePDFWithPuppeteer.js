const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

async function generatePDF(invoiceData, fileName) {
  const templatePath = path.join(__dirname, '../templates/invoice_template.html');
  const html = fs.readFileSync(templatePath, 'utf8');

  const compileTemplate = handlebars.compile(html);
  const finalHtml = compileTemplate({
    ...invoiceData,
    date: new Date().toLocaleDateString()
  });

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

  const pdfPath = path.join(__dirname, '../invoices', fileName);
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

  await browser.close();
  return pdfPath;
}

module.exports = generatePDF;
