module.exports = {
  name: "Xss Filter",
  filterRequest: (req) => {
    const dangerousPatterns = [
      /<script.*?>.*?<\/script>/i,          // standard script tag
      /<.*?script.*?>/i,                    // obfuscated script tags
      /javascript:/i,                       // inline JS
      /on\w+\s*=\s*['"].*?['"]/i,           // event handlers like onload=
      /<.*?\s+on\w+\s*=.*?>/i,              // tag with inline event
      /<img.*?src\s*=\s*['"]?javascript:/i, // JS in img src
      /&#x.*?;/i,                           // hex entity encoding
      /&lt;script.*?&gt;/i,                 // encoded <
    ] 
    const inputRaw = req.url + JSON.stringify(req.body || {}) + JSON.stringify(req.query || {}) 
    let input 
    try {
      input = decodeURIComponent(inputRaw) 
    } catch (e) {
      input = inputRaw 
    }
    console.log('[XSS] Checking input:', input) 
    for (let pattern of dangerousPatterns) {
      if (pattern.test(input)) {
        console.log('[!] XSS filter triggered:', input) 
        return false 
      }
    }
    return true 
  }
}
