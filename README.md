# SyncBoard Frontend

## Overview

SyncBoard Frontend is a modern React application designed for real-time project collaboration.

It provides:

* Authentication
* Project Management
* Task Management
* Real-time Updates
* Role-Based UI
* File Uploads
* Responsive Design

---

## Tech Stack

* React
* Vite
* Redux Toolkit
* React Router DOM
* Socket.io Client
* React Hook Form
* Tailwind CSS
* Axios
* React Hot Toast

---

## Features

### Authentication

* Login
* Registration
* Protected Routes
* Persistent Sessions

### Projects

* Project Listing
* Project Creation
* Member Invitations
* Activity Logs

### Tasks

* Create Task
* Update Task
* Delete Task
* Bulk Operations
* Search
* Filtering
* Sorting

### Real-Time Collaboration

* Instant Task Updates
* Notifications
* Live Project Synchronization

### Attachments

* Upload Files
* Preview Images
* Download Files
* Progress Tracking

---

## Folder Structure

src/

├── pages/

├── components/

├── store/

├── services/

├── hooks/

├── routes/

├── lib/

└── App.jsx

---

## Environment Variables

Create a .env file:

VITE_API_URL=

VITE_SOCKET_URL=

---

## Installation

npm install

npm run dev

---

## Build

npm run build

---

## State Management

Redux Toolkit is used for:

* Authentication
* Projects
* Tasks
* Notifications
* Invitations

---

## Routing

Protected routes are implemented using React Router.

Unauthorized users are redirected to login.

Role-based access controls are reflected in the UI.

---

## Performance Optimizations

* Lazy Loading
* Optimistic Updates
* Debounced Search
* Memoized Components
* Skeleton Loaders

---

## Deployment

Frontend deployed on Vercel.

Backend API connected through environment variables.

---

## Real-Time Implementation

Socket.io client connects to backend.

Users automatically join project rooms.

Task updates and notifications are synchronized instantly.

---

## Live Demo

Frontend URL: https://syncboard-app.vercel.app

Backend API: https://syncboard-server-p7ec.onrender.com

GitHub Repository Frontend: https://github.com/pradeeprdev/syncboard-app
GitHub Repository Backend: https://github.com/pradeeprdev/syncboard-server

