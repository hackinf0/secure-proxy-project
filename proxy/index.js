const express = require("express")
const { createProxyMiddleware } = require("http-proxy-middleware")
const querystring = require("querystring")
const bodyParser = require("body-parser")
require("dotenv").config()
const loadFilters = require("./config/loader")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto") // To generate our RID
const app = express()

const PORT = 8080
const TARGET = "http://dvwa" // the vulnerable app

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static("public"))

//load the filters

const filters = loadFilters()

// Middleware to log blocked requests
function logBlockedRequest(req, rid, reason) {
  const logEntry = `
=== [RID: ${rid}] ===
Time: ${new Date().toISOString()}
IP: ${req.ip}
Method: ${req.method}
URL: ${req.originalUrl}
Body: ${JSON.stringify(req.body || {})}
Reason: ${reason}
-------------------------------
`

  const logDir = path.join(__dirname, "logs")
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
  }

  fs.appendFileSync(path.join(logDir, "blocked_request.log"), logEntry)
}

// Middleware to apply all active filters
app.use((req, res, next) => {
  for (let filter of filters) {
    if (!filter.filterRequest(req)) {
      const rid = crypto.randomBytes(6).toString("hex").toUpperCase()

      const templatePath = path.join(__dirname, "public", "blocked.html")
      fs.readFile(templatePath, "utf8", (err, html) => {
        if (err) {
          console.error("Failed to read block page template", err)
          return res.status(403).send("Request Blocked")
        }
        const reason = filter.name || "Unknown filter"
        const finalHtml = html.replace("{{RID}}", rid)
        console.log(
          `[!] Blocked request. RID: ${rid} => ${req.method} ${req.url}`
        )
        logBlockedRequest(req, rid, reason)
        res.status(403).send(finalHtml)
      })

      return
    }
  }

  next()
})

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[Proxy] ${req.method} ${req.url} ${JSON.stringify(req.body)}`)
  next()
})

// Proxy all traffic to the vulnerable app
app.use(
  "/",
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    selfHandleResponse: false,
    onProxyReq: (proxyReq, req, res) => {
      if (
        req.method === "POST" &&
        req.headers["content-type"] === "application/x-www-form-urlencoded"
      ) {
        const bodyData = querystring.stringify(req.body)
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData))
        proxyReq.write(bodyData)
      }
    },
  })
)
app.listen(PORT, () => {
  console.log(`[+] Proxy listening on port ${PORT}, forwarding to ${TARGET}`)
})
