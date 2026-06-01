# SyncBoard Frontend

## Overview

SyncBoard Frontend is a modern React application designed for real-time project collaboration.

It provides:

* Authentication
* Project Management
* Task Management
* Real-time Updates
## SyncBoard Frontend

SyncBoard Frontend is a React + Vite application for real-time project collaboration. It includes auth, project/task management, attachments, and a realtime layer using Socket.io.

Quick start

```bash
cd syncboard-app
npm install
npm run dev
```

Environment

- Create `.env` from `.env.example` and set `VITE_API_URL`, `VITE_CLIENT_URL`, and optionally `VITE_SOCKET_URL`.

Build

```bash
npm run build
npm run preview
```

Notes

- Attachments upload is proxied through the backend to Cloudinary.
- Use the backend's dev responses when testing invites/resets (links may be returned).


