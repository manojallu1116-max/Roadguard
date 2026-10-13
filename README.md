# Road Damage Reporter

A road maintenance reporting app with a React frontend and an Express API backed by MongoDB.

## What changed
- Citizens can browse community reports and view only their own reports in My Activity.
- Approved administrators manage all reports, assignments, notes, and status updates from the Admin dashboard.
- Complaint images and locations are supplied with each report; map pins use saved coordinates.

## Run locally
1. Install dependencies: npm install
2. Copy `.env.example` to `.env` and provide `MONGODB_URI`, `DB_NAME`, and a strong `JWT_SECRET` (32+ characters).
3. Start the full stack app: npm run dev
4. Open http://localhost:5173

The API runs at http://localhost:3001/api/complaints.

## Build for production
- npm run build
- npm run start

## Deploy
This project uses separate Render (API) and Vercel (client) deployments.
- Set the start command to: npm start
- The Render service is API-only. Its root URL returns `{ "message": "RoadGuard API is running" }`; it does not require or serve a `dist/` frontend directory.
- Set `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, and optional `JWT_EXPIRES_IN` in the Render environment.
- On Vercel, set `VITE_API_URL` to the deployed Render API origin (for example `https://roadguard-api.onrender.com`). The frontend reports a configuration error instead of treating Vercel's SPA fallback as an API response when this value is missing.
- Optionally set `VITE_SUPPORT_EMAIL` on Vercel to display a support email on the landing page. No email address is assumed by the app.
- Ensure the platform exposes port 3001 or uses the PORT environment variable.

## Authentication
- `POST /api/auth/register` always creates an unapproved `citizen`; request roles are ignored.
- `POST /api/auth/login` returns a JWT for citizens and approved authorities only.
- To make an existing account an administrator, update it directly in MongoDB with `role: "admin"` and `isApproved: true`. The app never exposes a role selector or role-update API.
- The client stores the JWT in localStorage and routes users to `/citizen` (their own report statuses) or `/admin` (all reports and management controls). Legacy `authority` records are still accepted as admins.
- New reports are linked to the authenticated user server-side. `GET /api/complaints/community` requires authentication and returns community report details without reporter identity or internal authority notes; `GET /api/complaints/mine` returns the signed-in citizen's own reports. Only approved administrators can retrieve the full report list or update administrative fields.

## Notes
- Complaint documents are stored in MongoDB. `data/complaints.json` and `src/data/mockComplaints.js` are sample/local artifacts and are not automatically imported into MongoDB.
