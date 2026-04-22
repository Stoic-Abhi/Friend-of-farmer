# FarmDirect Monorepo

FarmDirect is organized as a monorepo with separate frontend and backend workspaces so both services can evolve independently while staying in one repository.

## Workspace Layout

```text
apps/
├── backend/   # Express API service
└── frontend/  # React + Vite web app
```

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Package management: npm workspaces

## Getting Started

### Install dependencies per workspace

```bash
npm install --workspace @farmdirect/frontend
npm install --workspace @farmdirect/backend
```

### Run the frontend

```bash
npm run dev:frontend
```

### Run the backend

```bash
npm run dev:backend
```

## Available Root Scripts

- `npm run dev:frontend`
- `npm run dev:backend`
- `npm run build`
- `npm run lint`
- `npm run start:backend`

## Backend Environment

Copy `apps/backend/.env.example` to `.env` inside `apps/backend` and update values as needed.
