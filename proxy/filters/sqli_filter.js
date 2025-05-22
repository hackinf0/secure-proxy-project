module.exports = {
  name: "SQLi Filter",
  filterRequest: (req) => {
    const dangerousPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /(\bOR\b|\bAND\b).*?=/i,
      /(\bUNION\b.*?\bSELECT\b)/i,
      /(\bSELECT\b.*?\bFROM\b)/i,
      /(\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b)/i
    ] 
   
    const inputRaw = req.url + JSON.stringify(req.body || {}) + JSON.stringify(req.query || {}) 
    let input 
    try {
      input = decodeURIComponent(inputRaw) 
    } catch (e) {
      input = inputRaw  
    }
    console.log('[SQLi] Checking input:', input) 
    for (let pattern of dangerousPatterns) {
      if (pattern.test(input)) {
        console.log('[!] SQLi filter triggered:', input) 
        return false 
      }
    }
    return true 
  }
}
