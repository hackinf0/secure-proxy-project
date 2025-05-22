module.exports = {
    name: "Cmdi Filter",
    filterRequest: (req) => {
      const dangerousPatterns = [
        /;/,                // semicolon to chain commands
        /\|\|/,             // logical OR
        /&&/,               // logical AND
        /`.*?`/,            // backtick execution
        /\$\(.+?\)/,        // command substitution
        /\b(whoami|id|uname|ping|ls|cat|curl|wget)\b/i
      ] 
  
      const inputRaw = req.url + JSON.stringify(req.body || {}) + JSON.stringify(req.query || {}) 
      let input 
      try {
        input = decodeURIComponent(inputRaw) 
      } catch (e) {
        input = inputRaw 
      }
  
      console.log('[CMDi] Checking input:', input) 
  
      for (let pattern of dangerousPatterns) {
        if (pattern.test(input)) {
          console.log('[!] CMDi filter triggered:', input) 
          return false 
        }
      }
  
      return true 
    }
  }
  