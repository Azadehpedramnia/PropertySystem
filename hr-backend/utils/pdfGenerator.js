// utils/pdfGenerator.js
const puppeteer = require('puppeteer');

async function generateProposalPDF(htmlContent) {
  // Launch headless Chromium
  const browser = await puppeteer.launch({
    // On some environments you may need:
     args: ['--no-sandbox', '--disable-setuid-sandbox']
    
  });
  const page = await browser.newPage();

  // Set the HTML to render
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0',
  });

  // Produce a PDF buffer
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = { generateProposalPDF };
