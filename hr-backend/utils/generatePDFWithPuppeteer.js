{/*const puppeteer = require('puppeteer');
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

module.exports = generatePDF;*/}
const puppeteer = require('puppeteer');
const bgAbsolutePath = path.resolve(__dirname, '../templates/invoiceTemplate.png');
// Pass to HTML generator:
const html = generateInvoiceHTML({...otherData, bg_absolute_path: bgAbsolutePath });

async function generatePDF(html, outputPath) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await browser.close();
}

module.exports = generatePDF;

