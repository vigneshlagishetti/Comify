# Company Registration & Verification Module

A comprehensive web application for company registration and profile management built with React, Supabase, and Shadcn/ui.

## 🚀 Features

- **Multi-step Company Registration**: Beautiful step-by-step registration form with validation
- **User Authentication**: Email/password login with SMS OTP verification via Supabase Auth
- **Company Profile Management**: Complete CRUD operations for company profiles
- **Image Upload**: Company logo and banner upload via Cloudinary
- **Responsive Design**: Mobile-first responsive design using Tailwind CSS and Shadcn/ui
- **Real-time Updates**: Real-time data synchronization with Supabase
- **Type-safe Forms**: Form validation using React Hook Form and Zod
- **State Management**: Global state management with Redux Toolkit

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and development server
- **Shadcn/ui** - Modern UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **React Router DOM** - Client-side routing
- **TanStack Query** - Server state management
- **React Toastify** - Toast notifications

### Backend & Services
- **Supabase** - Backend-as-a-Service (Database, Auth, Real-time)
- **PostgreSQL** - Database (via Supabase)
- **Cloudinary** - Image upload and storage
- **Row Level Security** - Database security policies

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Cloudinary account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Brahmaiah_Project
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the frontend directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary Configuration  
# Comify — Company Registration & Dashboard

Comify is a full-stack company registration, profile management, and employer dashboard application. It combines a React + Vite frontend with Supabase/Postgres backend patterns and includes features such as multi-step company registration, job posting dashboard, company profiles, and admin-style management views.

This README documents everything implemented in the repository, how to run it locally, environment variables, and troubleshooting notes.

Table of contents
- Features
- Tech stack
- What’s implemented (detailed)
- Project structure (important files)
- Running locally
- Environment variables
- Database & schema
- Routes / endpoints
- Common troubleshooting
- Next steps & TODOs

## Features

- Multi-step company registration form with validation and image uploads (logo/banner)
- Full employer dashboard with these sections: Overview, Employers Profile, Post a Job, My Jobs, Saved Candidates, Plans & Billing (stub), All Companies (directory), Settings
- Job posting flow with rich fields (title, department, location, type, salary range, description, requirements) and mock persistence
- My Jobs management: cards with actions (edit, view, pause/activate, delete), stats, and filters
- Company profile CRUD: create, edit, and view company data (logo/banner, social links, verification status)
- Authentication scaffolding using Clerk / Supabase (project includes Clerk integration points and Supabase usage patterns)
- Image upload support via Cloudinary integration (frontend wiring and env variables present)
- Type-safe forms using React Hook Form + Zod
- UI built with shadcn/ui components + Tailwind CSS
- Global state with Redux Toolkit and server state patterns using TanStack Query

## Tech stack

- Frontend: React 18, Vite, Tailwind CSS, shadcn/ui
- State & forms: Redux Toolkit, React Hook Form, Zod, TanStack Query
- Auth & backend patterns: Clerk (auth), Supabase (db patterns), PostgreSQL
- Storage: Cloudinary (image uploads)

## What’s implemented (detailed)

Note: I inspected and documented the current working components. If you add new files later, update this README accordingly.

- Frontend pages/components (key files)
   - `src/components/JobpilotDashboard.jsx` — Full employer dashboard UI and navigation (renamed branding to Comify in UI). Contains sections:
      - Overview: welcome, stats grid, charts (mock)
      - Employers Profile: company header, stats, activity timeline, company form (edit)
      - Post a Job: comprehensive job posting form
      - My Jobs: card-based job listings with actions
      - Saved Candidates: saved candidates list
      - Plans & Billing: billing UI scaffold (usage, history)
      - All Companies: company directory cards
      - Settings: multi-tab settings area
   - `src/components/CompanyRegistrationForm.jsx` — Multi-step company registration form (4 steps: company info, address, additional info, logo/banner upload). Uses Zod validation and uploads to Cloudinary.
   - `src/components/LandingPage.jsx` — Marketing home page and CTA flows. Routes users to registration or dashboard based on sign-in and company registration status.
   - `src/components/JobpilotRegister.jsx`, `src/components/JobpilotComplete.jsx` (and simple variants) — Alternate registration interfaces and completion flows for onboarding.
   - `src/components/auth/*` — Authentication components (Register, Clerk integration wrappers).
   - `src/components/company/CompanyProfile.jsx` — Company profile viewer used in dashboard and landing flow.
   - `src/components/dashboard/Dashboard.jsx` — Additional dashboard utilities and stubbed admin views.

- Utilities & config
   - `index.html` — App title changed to Comify
   - `.gitignore` — Updated to include standard Node/Tailwind/Vite ignores and project-specific cache files
   - `.vscode/settings.json` — Workspace association for SQL -> Postgres (optional)

- DB schema
   - `supabase_schema_clerk.sql` — PostgreSQL schema for `users` and `company_profile` with triggers, indexes and a view. NOTE: This file is valid PostgreSQL but may show lint errors in VS Code if language mode isn't set to PostgreSQL.

## Project structure (important files)

Top-level (important)

- `frontend/` — React frontend (Vite)
- `backend/` — (If present) Backend server code
- `supabase_schema_clerk.sql` — Database schema for Supabase/Postgres
- `.gitignore`, `.vscode/settings.json`
- `README.md` (this file)

Frontend notable paths

- `frontend/src/components/JobpilotDashboard.jsx` — Main dashboard
- `frontend/src/components/CompanyRegistrationForm.jsx` — Company registration
- `frontend/src/components/LandingPage.jsx` — Landing page with CTA
- `frontend/src/App.jsx` — Router and top-level routes

## Running locally

Follow these steps to run the project locally (frontend + Supabase patterns described):

1) Clone repo and install

```bash
git clone <repo-url>
cd Brahmaiah_Project/frontend
npm install
```

2) Environment variables (create `.env` in `frontend/`)

Create `frontend/.env` and add:

```env
# Clerk (if using Clerk integration)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Supabase (if using Supabase patterns)
VITE_SUPABASE_URL=https://your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Cloudinary for image uploads
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Other optional settings
NODE_ENV=development
```

3) Run the frontend development server

```bash
# from frontend/
npm run dev
```

The app serves on the port Vite assigns (commonly `http://localhost:5173`), or `http://localhost:3000` depending on your config.

4) Local backend / Supabase

- If you use Supabase, create a Supabase project and run the SQL in `supabase_schema_clerk.sql` in the SQL editor.
- If you run a local backend, point the frontend to the local API via env vars and start it in `backend/` (if present).

## Environment variables (summary)

- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk public key (if using Clerk)
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key
- `VITE_CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `VITE_CLOUDINARY_UPLOAD_PRESET` — Cloudinary upload preset (unsigned)

## Database & schema

- Run `supabase_schema_clerk.sql` in Supabase SQL editor. It contains:
   - `users` table (UUID PK, clerk_id, email, full_name, mobile_no, gender, timestamps)
   - `company_profile` table (UUID PK, owner_id FK -> users, company details, verification_status, timestamps)
   - `update_updated_at_column()` trigger function and triggers
   - Indexes and a view `company_profiles_with_users`

Note: If VS Code shows lint errors for `supabase_schema_clerk.sql`, change the language mode to **PostgreSQL** (bottom-right in VS Code) or install a PostgreSQL extension like `ms-ossdata.vscode-pgsql`.

## Routes / Endpoints (frontend interactions)

- Landing page checks company profile: `GET /api/company-profile/:userId` (this route is used by landing and may 404 if backend not running)
- Job posting and company profile operations are currently implemented in the frontend with mock data or via Supabase REST endpoints if you configured Supabase.

## Troubleshooting

- If dashboard navigation shows only the Settings tab and content doesn't load, check console/network for failed API calls. Landing page and dashboard expect `GET /api/company-profile/:userId`. If your backend is not running, the frontend will fall back to mock data in many places but some flows expect the API.
- SQL linting errors in editors: set file language to PostgreSQL to stop incorrect SQL Server parsing errors.
- If file rename commands fail in PowerShell, use:

```powershell
# PowerShell rename
Rename-Item -Path .\supabase_schema_clerk.sql -NewName supabase_schema_clerk.pgsql
```

## Next steps & TODOs

- Complete Saved Candidates UI and interactions
- Implement full Plans & Billing backend integration
- Hook My Jobs and Job posting to a persistent backend (Supabase or custom API)
- Add unit and E2E tests

---

If you want, I can also:

- Add a smaller `README-frontend.md` inside `frontend/` with exact npm commands and environment variable examples
- Generate a basic `docker-compose.yml` to run a local Postgres + Adminer for local development

Tell me which of those you'd like next and I’ll add it.
