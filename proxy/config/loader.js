const fs = require('fs');
const path = require('path');

function loadFilters() {
  const filters = [];

  if (process.env.ENABLE_SQLI_FILTER === 'true') {
    console.log('[+] SQLi filter enabled')
    filters.push(require('../filters/sqli_filter'));
    console.log(' SQLi filter enabled');
  }

  if (process.env.ENABLE_XSS_FILTER === 'true') {
    console.log('[+] XSS filter enabled')
    filters.push(require('../filters/xss_filter'));
    console.log(' XSS filter enabled');
  }

  return filters;
}

module.exports = loadFilters;
