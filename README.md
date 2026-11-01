# Bharat Netra

Bharat Netra is a web-based OSINT and security-reconnaissance toolkit. It brings domain, IP, email, and network lookups together in one account-protected workspace.

## Who is it for?

Bharat Netra is intended for:

- Cybersecurity students learning about OSINT and security analysis
- Developers and system administrators investigating their own systems
- Security researchers conducting authorized, defensive investigations

Use the tools only on systems and data you own or have permission to investigate.

## What can you do?

Create an account, sign in, select a tool in the Intelligence Workspace, and enter the requested information.

| Tool | What it does |
| --- | --- |
| WHOIS Lookup | Retrieves public domain registration and registrar information. |
| Subdomain Finder | Looks for subdomains associated with a domain. |
| IP History Lookup | Retrieves historical DNS IP records for a domain. Requires a SecurityTrails API key. |
| Reverse IP Lookup | Collects available information about an IP, such as DNS, registration, reputation, or related hosts. Results depend on configured providers. |
| MAC Address Lookup | Looks up the manufacturer associated with a MAC address. Requires a macaddress.io API key. |
| Mobile Carrier Lookup | Checks phone-number validity, country, carrier, and number type. Requires a Veriphone API key. |
| Malware Check | Requests URL reputation and scan information from VirusTotal. Requires a VirusTotal API key. |
| Password Hash Breaker | Checks supported MD5, SHA-1, SHA-256, or SHA-512 hashes against a local dictionary. This is a limited dictionary check, not general password recovery. |
| Port Scanner | Checks specified TCP ports on a host. Only scan systems you are authorized to test. |
| Email Header Analyzer | Parses email headers, extracts sending IPs and the sender domain, and checks SPF and DMARC records. |
| Email Validator | Checks email format and available email/domain indicators. Requires an Abstract API key. |

Lookup results may be incomplete, rate-limited, or unavailable. Treat them as informational leads, not definitive proof that a system or message is safe or malicious.

## Tech stack

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** Account registration and login with an HTTP-only session cookie
- **Data sources:** DNS, WHOIS, and optional third-party APIs

## Run locally

### Requirements

- Node.js and npm
- A MongoDB database

### 1. Configure and start the backend

Open a terminal in the project folder:

```bash
cd server
npm install
