Plant Disease System

Quick start:
1. Install everything: `npm install` (at root) then `npm run install-all` or run `npm install` separately in `/server` and `/client`.
2. Start server: `cd server && npm start` (server runs on port 5001).
3. Start client: `cd client && npm run dev` (vite runs on 5173).

Features:
- Home page with project name in BOLD UPPERCASE
- Gallery page: sample images, upload from device, capture from camera, preview
- Express backend accepts uploads and returns a mock detection

Notes:
- Uses remote sample/background images from Unsplash. Replace with your own images by editing `src/pages/Home.jsx` and `src/pages/Gallery.jsx`.
