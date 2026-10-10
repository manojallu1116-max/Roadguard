# Road Damage Reporter

A live-ready road maintenance reporting app with a React frontend and a lightweight JSON-backed backend for persistent complaint storage.

## What changed
- Added a Node/Express API for complaint persistence
- Wired the UI to load and save reports from the backend
- Added a simple backend regression test
- Added production-friendly scripts and deployment files

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
This project is ready for deployment on Render (API) and Vercel (client), or as a single Render deployment.
- Set the start command to: npm start
- Set `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, and optional `JWT_EXPIRES_IN` in the Render environment.
- On Vercel, set `VITE_API_URL` to the deployed Render API origin (for example `https://roadguard-api.onrender.com`).
- Ensure the platform exposes port 3001 or uses the PORT environment variable.

## Authentication
- `POST /api/auth/register` always creates an unapproved `citizen`; request roles are ignored.
- `POST /api/auth/login` returns a JWT for citizens and approved authorities only.
- To make an existing account an administrator, update it directly in MongoDB with `role: "admin"` and `isApproved: true`. The app never exposes a role selector or role-update API.
- The client stores the JWT in localStorage and routes users to `/citizen` (their own report statuses) or `/admin` (all reports and management controls). Legacy `authority` records are still accepted as admins.
- New reports are linked to the authenticated user server-side. Citizens can retrieve only their own reports through `GET /api/complaints/mine`; admins can retrieve the full report list.

## Notes
- Complaints are stored in data/complaints.json
- The app uses the existing mock seed data as the initial dataset
