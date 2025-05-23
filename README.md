
# Proxy Project

Overview

This project demonstrates a proxy-based security filter protecting a vulnerable web application. Instead of modifying the web server directly, a dedicated HTTP proxy intercepts requests and filters malicious inputs. An attacker container simulates exploitation attempts (e.g., SQLi, XSS, CMDi).


## Architecture
| **Component** | **Description**                             | **Ports**   | **Networks**         |
|---------------|---------------------------------------------|-------------|----------------------|
| `mysql`       | MySQL 5.7 database for DVWA                 | -           | `backend`            |
| `dvwa`        | Vulnerable web app (DVWA)                   | `80`        | `backend`            |
| `proxy-app`   | Proxy server applying security filters      | `8080:8080` | `frontend`, `backend`|
| `attacker`    | CLI node that runs automated attack scripts | -           | `frontend`           |

## Download the project

Download the project  

```bash
git clone https://github.com/hackinf0/secure-proxy-project
cd secure-proxy-project
```
    
## How to run the project

How to Run
🛠 Requirements
```
Docker
Docker Compose
```

Build & Start Containers

```
docker network create backend
docker network create frontend
docker-compose up --build
```

Wait a few moments for DVWA to initialize.
## Project Structure

```bash 
secure-proxy-project/
├── docker-compose.yml
├── proxy/
│   ├── index.js
│   ├── Dockerfile
│   ├── filters/
│   │   ├── sqli_filter.js
│   │   ├── xss_filter.js
│   │   └── cmdi_filter.js
│   ├── config/
│   │   └── loader.js
│   ├── logs/
│   │   └── blocked_requests.log
│   └── public/
│       ├── blocked.html
│       └── img.jpg
├── attacker/
│   ├── Dockerfile
│   ├── scripts/
│   │   ├── sqli_test.sh
│   │   ├── xss_test.py
│   │   └── cmdi_test.py

 ``` 
## Filters Functionality

The proxy filters block requests matching attack patterns:

| **Filter** | **Description**                                             | **Toggle**                 |
|------------|-------------------------------------------------------------|----------------------------|
| SQLi       | Blocks SQL injection payloads (e.g., `OR 1=1`)              | `ENABLE_SQLI_FILTER=true` |
| XSS        | Blocks reflected XSS payloads (e.g., `<script>`)            | `ENABLE_XSS_FILTER=true`  |
| CMDi       | Blocks OS command injection (e.g., `127.0.0.1; id`)         | `ENABLE_CMDI_FILTER=true` |

> Enable/disable via environment variables in `docker-compose.yml`.

## Attacker Scripts

Run from inside the attacker container:


```bash
docker exec -it attacker sh
```
```
cd /app/scripts
```
Xss test script
```
python3 xss_test.py
```
Cmdi test script

```
python3 cmdi_test.py
```
Sql test with sqlmap

```
sqlmap -u "http://proxy-app:8080/vulnerabilities/sqli/?id=1&Submit=Submit#" \
--cookie="PHPSESSID=your-session-id; security=low" \
--tamper=space2comment --random-agent --level=5 --risk=3 --batch
```

**NB: You must manually log in to DVWA and set the security level to low, then copy your session cookie into the scripts.**

## Block Page with RID

When a request is blocked, the proxy:

    Returns a styled 403 error page (blocked.html)

    Includes a Request ID (RID) for reference

    Logs the full request and RID in logs/blocked_requests.log


Example:

```
=== [RID: 99EE6D4B09B6] ===
Time: 2025-05-22T19:03:07.584Z
IP: ::ffff:172.18.0.1
Method: GET
URL: /vulnerabilities/sqli/?id=1%27+OR+1%3D1--
Body: {}
Reason: SQLi Filter
-------------------------------
```
## Extensibility

New filters can be added easily.

Filter Structure

Each filter module exports an object containing:

    A name (for logging)

    A filterRequest(req) function that:

        Analyzes req.url, req.body, and req.query

        Checks for dangerous patterns using regular expressions

        Returns false to block a request or true to allow it

This makes the proxy dynamically pluggable and extensible for future vulnerabilities.

steps to Add a New Filter

 - Create a New Filter File
 - Create a new file in proxy/filters/ (proxy/filters/new_filter.js)

Implement the Filter Logic 

    Export a filterRequest(req) method

Load it via loader.js :

Add a condition in proxy/config/loader.js to load your new filter based on an environment variable:

```
if (process.env.ENABLE_NEW_FILTER === 'true') {
  filters.push(require('../filters/new_filter'));
  console.log('[+] New filter enabled');
}
```
## Testing Checklist

```
XSS: Reflected XSS  

SQLi: SQL Injection  

CMDi: Command Injection

Check the logs 

```