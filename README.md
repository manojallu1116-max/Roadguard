# Road Damage Reporter

A live-ready road maintenance reporting app with a React frontend and a lightweight JSON-backed backend for persistent complaint storage.

## What changed
- Added a Node/Express API for complaint persistence
- Wired the UI to load and save reports from the backend
- Added a simple backend regression test
- Added production-friendly scripts and deployment files

## Run locally
1. Install dependencies: npm install
2. Start the full stack app: npm run dev
3. Open http://localhost:5173

The API runs at http://localhost:3001/api/complaints.

## Build for production
- npm run build
- npm run start

## Deploy
This project is ready for deployment on services like Render, Railway, or Heroku.
- Set the start command to: npm start
- Ensure the platform exposes port 3001 or uses the PORT environment variable

## Notes
- Complaints are stored in data/complaints.json
- The app uses the existing mock seed data as the initial dataset
