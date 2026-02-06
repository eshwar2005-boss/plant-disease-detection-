Plant Disease System — frontend (Vite + React)

Commands:
- npm install
- npm start   # runs Vite dev server

The frontend calls the backend using the Vite env variable `VITE_API_URL` (set in .env), or falls back to http://127.0.0.1:5001 by default.

Examples (from project root):
- Start backend: npm --prefix ./plant-disease-system/server start
- Start frontend: npm --prefix ./plant-disease-system/client start

You can set a custom backend URL by creating `client/.env` with:
VITE_API_URL=http://your-backend-host:5001
