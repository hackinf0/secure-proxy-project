const express = require("express")
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config()
const loadFilters = require("./config/loader")

const app = express()

const PORT = 8080
const TARGET = "http://dvwa" // the vulnerable app

//load the filters

const filters = loadFilters()

// Middleware to apply all active filters
app.use((req, res, next) => {
  for (let filter of filters) {
    if (!filter.filterRequest(req)) {
      return res.status(403).send("Blocked by proxy filter")
    }
  }
  next()
})

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[Proxy] ${req.method} ${req.url}`)
  next()
})

// Proxy all traffic to the vulnerable app  
app.use('/', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true
}));
app.listen(PORT, () => {
  console.log(`[+] Proxy listening on port ${PORT}, forwarding to ${TARGET}`)
})
