{/*const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

async function generateInvoiceHTML(invoiceData) {
  const filePath = path.join(__dirname, '..', 'templates', 'invoiceTemplate.html');
  const html = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(html);
  return template(invoiceData);
}

module.exports = generateInvoiceHTML;*/}


const fs = require('fs');
const path = require('path');

function generateInvoiceHTML(data) {
  // Read the HTML template
  let template = fs.readFileSync(
  path.join(__dirname, '../public/templates/invoiceTemplate.html'),
  'utf8'
);

 // let template = fs.readFileSync(path.join(__dirname, '../templates/invoiceTemplate.html'), 'utf8');
  // Replace all placeholders with data (including bg_absolute_path!)
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, data[key]);
  });
  return template;
}

module.exports = generateInvoiceHTML;

