# SyncBoard Frontend

This is the React + Vite frontend for SyncBoard — a realtime project management app. It includes routing, a Redux Toolkit store, and components for projects, tasks, attachments, and authentication.

Quick start

1. Copy the `.env.example` to `.env` and set `VITE_API_URL` and `VITE_CLIENT_URL`.

2. Install and run in development:

```bash
cd syncboard-app
npm install
npm run dev
```

Environment variables

- `VITE_API_URL` — API base URL (e.g. `http://localhost:5050`)
- `VITE_CLIENT_URL` — client public URL used in emails (e.g. `http://localhost:5173`)
- `VITE_SOCKET_URL` — socket server URL (optional)

Build

```bash
npm run build
npm run preview
```

Notes

- Notifications use `react-hot-toast`.
- Attachments are uploaded via backend to Cloudinary.
- The app expects the backend to provide invite/reset links in development for easier testing.

Contributing

Open a PR with focused changes and include tests when appropriate.