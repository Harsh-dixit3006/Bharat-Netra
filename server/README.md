# Server configuration

Copy `.env.example` to `.env` and set `MONGO_URI` and a long, unique `JWT_SECRET`
before starting the server. In production, set `NODE_ENV=production` and set
`CLIENT_URL` to the frontend origin. The frontend and backend must both use
HTTPS in production because authentication uses a secure, HttpOnly cookie.

The public authentication endpoints are:

- `POST /api/auth/register` with `{ "name", "email", "password" }`
- `POST /api/auth/login` with `{ "email", "password" }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

All other `/api` endpoints require a valid session cookie.
