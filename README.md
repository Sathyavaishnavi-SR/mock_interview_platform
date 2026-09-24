# AI Mock Interview Platform for College Students

An AI-powered full-stack mock interview platform designed specifically for college students preparing for technical and behavioral interviews.

---

## Architecture & Content Approval Flow

### Core User & Content Flow

```
USER
 │
 ├── Post Interview Experience ──┐
 │                               ↓
 ├── Post Interview Questions → PENDING
 │                               ↓
 │                    Global / Local Admin
 │                               ↓
 │                    APPROVED / REJECTED
 │                               ↓
 │                     Approved Content
 │                               ↓
 └── Practice Interview
          ↓
      Upload Resume
          ↓
   Resume Analysis + Approved Content (Question Bank prioritized)
          ↓
     AI Question Generation (Pulls from Approved Question Bank first; falls back to AI generation if unavailable)
          ↓
      Mock Interview
          ↓
    AI Evaluation
          ↓
      Score /100
          ↓
       Results
          ↓
      Dashboard
```

### Content Approval Business Rule
- **Submitted Content:** Any interview experience or question submitted by a user enters a `pending` state.
- **Review:** Global Admins or Local Admins review pending submissions to `approve` or `reject` them.
- **AI Interview System Constraints:** The AI question generation engine exclusively pulls from **Approved** questions and experiences. Pending or rejected submissions are strictly excluded.
- **Question Bank Prioritization:** Generated mock interview questions are drawn primarily from the approved question bank; if suitable questions are unavailable for the specific role/domain, the AI dynamically generates targeted questions based on the candidate's uploaded resume.

---

## Project Structure

```
mock-interview-platform/
│
├── frontend/                  # Vite + React Frontend Client
│   ├── public/                # Static public assets
│   ├── src/
│   │   ├── assets/            # Static image/media assets
│   │   ├── components/        # Reusable UI components & ProtectedRoute
│   │   ├── pages/             # Page view components (User + Admin subfolder)
│   │   │   └── admin/         # Global & Local Admin management views
│   │   ├── three/             # Isolated React Three Fiber 3D modules
│   │   ├── services/          # API abstraction layer (api.js via native fetch)
│   │   ├── context/           # React contexts (e.g., AuthContext)
│   │   ├── hooks/             # Custom React hooks (e.g., useAuth)
│   │   ├── utils/             # Helper utilities
│   │   ├── App.jsx            # React Router setup
│   │   ├── main.jsx           # React app entry point
│   │   └── index.css          # Base global styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Node.js + Express API Backend
│   ├── src/
│   │   ├── controllers/       # Route request handlers
│   │   ├── routes/            # Express route declarations
│   │   ├── middleware/        # Auth & Role verification middlewares
│   │   ├── services/          # Supabase, AI, and Resume processing services
│   │   ├── config/            # Server & external client configurations
│   │   └── server.js          # Express app entrypoint & health check endpoint
│   ├── package.json
│   └── .env.example
│
├── .gitignore                 # Workspace git exclusion rules
├── README.md                  # System overview and architectural documentation
└── package.json               # Workspace root task runner config
```

---

## Tech Stack

- **Frontend:** React (Vite), React Router DOM, React Three Fiber (`@react-three/fiber`), Three.js (`three`), Drei (`@react-three/drei`).
- **Backend:** Node.js, Express.js, Cors, Dotenv.
- **Database (Future):** Supabase.
- **AI (Future):** Express API integration with LLM services.

---

## Getting Started

### Installation
From the project root, install dependencies for both `frontend` and `backend`:

```bash
# Install root tools
npm install

# Install dependencies for frontend & backend
npm run install:all
```

Or install individually:

```bash
cd frontend && npm install
cd ../backend && npm install
```

### Running in Development

```bash
# Run backend and frontend concurrently from root
npm start

# Or run individually:
# Frontend (runs on http://localhost:5173)
npm run dev:frontend

# Backend (runs on http://localhost:5000)
npm run dev:backend
```

### Health Check Endpoint
To verify backend status:
`GET http://localhost:5000/api/health`

