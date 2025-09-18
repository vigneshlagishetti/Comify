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


### 3. Environment Configuration

To avoid exposing secrets in source, this project uses an example file at `frontend/.env.example`. Copy that file to `frontend/.env` and fill in your values locally. Do NOT commit `frontend/.env` to the repository.

Steps:

```bash
cd frontend
cp .env.example .env
# open .env and fill the values
```

Important keys (set these in `frontend/.env`):

```env
# Clerk (if used)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...

# Supabase
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset

# Optional local API base URL
VITE_API_BASE_URL=http://localhost:5000
```

Notes:

- `.gitignore` already contains `.env` patterns so local `.env` will not be committed.
- Keep server-side secrets (Clerk secret keys, Supabase service_role key) out of the frontend; store them in server-side env or secret manager.

## Features
If you want, I can also:

- Add a smaller `README-frontend.md` inside `frontend/` with exact npm commands and environment variable examples
- Generate a basic `docker-compose.yml` to run a local Postgres + Adminer for local development

Tell me which of those you'd like next and I’ll add it.
