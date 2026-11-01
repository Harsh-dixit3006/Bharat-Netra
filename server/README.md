# Server configuration

Copy `.env.example` to `.env` and set `MONGO_URI` and a long, unique `JWT_SECRET`
before starting the server. Configure the provider keys for the tools you use;
the application reports a clear configuration error when a required key is
missing. Keep all provider keys on the server and never add them to the client.

In production, set `NODE_ENV=production` and `CLIENT_URL` to the frontend origin.
The Vercel client forwards `/api/*` requests through its same-origin rewrite, so
leave `VITE_API_URL` unset in the production client environment. This keeps the
HttpOnly session cookie first-party. The frontend and backend must both use
HTTPS in production.

Provider keys used by the tools:

- `ABSTRACT_API_KEY`: Email Validator
- `VERIPHONE_API_KEY`: Mobile Carrier Lookup
- `MAC_API_KEY`: MAC Address Lookup
- `SECURITYTRAILS_API_KEY`: IP History Lookup
- `VIRUSTOTAL_API_KEY`: Malware Check and reputation data
- `SHODAN_API_KEY` and `ABUSEIPDB_API_KEY`: optional Reverse IP Lookup sources

Email Validator works without `ABSTRACT_API_KEY` using local email-format and
mail-domain DNS checks. Mailbox existence, disposable/free-mail classification,
and SMTP checks require the Abstract API key.

The public authentication endpoints are:

- `POST /api/auth/register` with `{ "name", "email", "password" }`
- `POST /api/auth/login` with `{ "email", "password" }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

All other `/api` endpoints require a valid session cookie.
