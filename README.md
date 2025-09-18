# Company Registration & Employer Dashboard (Comify)

This repository contains a React + Vite frontend (Comify) focused on company registration, employer dashboards, and related UI flows. The project integrates with Clerk (optional), Supabase/Postgres (or a local API), and Cloudinary for image uploads. The README below lists what has already been implemented, how to run the frontend locally, expected backend endpoints, environment variables, troubleshooting tips, and next steps.

## Quick overview — what has been implemented

- Branding: UI text updated to "Comify" across the app (formerly Jobpilot/CompanyReg).
- Multi-step company registration form (`frontend/src/components/CompanyRegistrationForm.jsx`)
	- 4-step wizard (Company Info, Address, Additional Info, Logo & Banner)
	- Client-side validation with Zod + React Hook Form
	- Image upload integration to Cloudinary (unsigned preset)
	- Saves company record via `db.companies.create(...)` (abstracted DB helper)
- Employer Dashboard (`frontend/src/components/JobpilotDashboard.jsx`) — renamed visually to Comify Dashboard
	- Sidebar navigation with the following tabs: Overview, Employers Profile, Post a Job, My Jobs, Saved Candidate, Plans & Billing, All Companies, Settings
	- Each tab has full UI layouts and mock data (recent jobs, candidates, stats, billing history, all companies cards)
	- Post a Job form and My Jobs listing (client-side forms + mock CRUD UI)
	- Company Profile and Settings (multi-tab settings: company info, founding info, social media, account settings)
	- File upload UI for company logo/banner (2MB client-side limit and type checks)
- Company profile component (`frontend/src/components/CompanyProfile.jsx`) with editable fields and update flow
- Landing page (`frontend/src/components/LandingPage.jsx`) with registration CTA and check for existing company via API
- Auth-related components: `frontend/src/components/auth/ClerkAuth.jsx`, `Register.jsx`, and route guards `ProtectedRoute.jsx` / `PublicRoute.jsx` (Clerk integration points)
- UI primitives (`frontend/src/components/ui/*`) — reusable inputs, buttons, cards, tabs, select, file-upload, avatar, etc. (shadcn/ui + Tailwind)
- State management scaffolding (Redux Toolkit slices referenced: `companySlice`, `auth` slice usage)
- Documentation and workspace hygiene
	- `.gitignore` expanded (ignore .env, editor files, .github etc.)
	- `CLAUDE.md` and `clerksetupguide.md` added at repo root
	- `supabase_schema_clerk.sql` (Postgres schema file present) — header comment added to help editor dialect detection

Note: Many flows use mock data and client-side UI. Some features expect a backend or Supabase bindings to be present (see "Backend expectations" below).

## Tech stack (observed in the project)

- Frontend: React 18, Vite, Tailwind CSS, shadcn/ui
- Forms & validation: React Hook Form, Zod
- State & server state: Redux Toolkit, TanStack Query (used in some places)
- Auth: Clerk (integration points present)
- Storage: Cloudinary for images
- DB/Backend: Supabase / PostgreSQL (SQL schema present), and a local API at http://localhost:5000 is assumed by some components

## How to run the frontend locally

1) Install dependencies

 - Open a terminal, then:

	 cd frontend
	 npm install

2) Create your local env

 - Copy the example env into a local .env (this file is gitignored):

	 cd frontend
	 copy .env.example .env    (Windows cmd) OR cp .env.example .env (PowerShell/WSL/git-bash)

 - Fill the values in `frontend/.env` (see next section for required keys).

3) Run the dev server

	 npm run dev

 - Vite will typically serve at http://localhost:5173 (check the terminal output).
 - The frontend expects an API or Supabase to be available for full functionality (see Backend expectations).

4) Build for production

	 npm run build

5) Lint / format (if configured in your environment)

	 npm run lint   (project-specific scripts may vary)

## Environment variables (frontend/.env)

The frontend relies on these environment variables (present in `frontend/.env.example`):

- VITE_CLERK_PUBLISHABLE_KEY — optional (Clerk client-side key)
- VITE_SUPABASE_URL — Supabase project URL (if using Supabase)
- VITE_SUPABASE_ANON_KEY — Supabase anon key
- VITE_CLOUDINARY_CLOUD_NAME — Cloudinary cloud name (for direct uploads)
- VITE_CLOUDINARY_UPLOAD_PRESET — unsigned upload preset for Cloudinary
- VITE_API_BASE_URL — Optional. If present, components use this base for API calls (defaults to http://localhost:5000 in some components)

Important: Do NOT commit secrets (private keys, service_role keys) to the repo. Frontend .env is gitignored.

## Backend / API expectations

The frontend calls these endpoints (the project references them in a few places):

- GET /api/company-profile/:userId  — used by `LandingPage.jsx` and `JobpilotDashboard.jsx` to detect existing company profile
- PUT /api/company-profile/:userId  — used to update company profile from dashboard settings

If you are using Supabase directly, those calls may be replaced by Supabase client calls. Some components also call `db.companies.create(...)` or `db.companies.update(...)` via a small DB wrapper (`/frontend/src/lib/supabase` or `db` abstraction) — ensure that `db` is configured or implement equivalent API endpoints.

If the backend endpoints are missing, the frontend will show loading or fallback/mock data. The common symptom reported earlier was repeated 404s for GET /api/company-profile/:userId — add the endpoint or mock it locally to proceed.

## Backend — architecture, schema, endpoints and examples

This project can be integrated with two common backend approaches. Choose the one that fits your team and infrastructure:

- Option A — Supabase-first (recommended if you want minimal server code)
	- Use Supabase for Postgres, Auth, and real-time features. The frontend can call Supabase directly using `@supabase/supabase-js`, or you can implement small server-side functions for additional logic (e.g., image processing, payment webhooks).
	- Advantages: faster to start, built-in Auth + RLS, hosted Postgres, simple SQL editor for `supabase_schema_clerk.sql`.

- Option B — Minimal Node/Express + Postgres API (recommended for custom business logic)
	- Run a small Express (or Fastify) application that provides the REST endpoints the frontend expects and proxies requests to the database. This is useful if you need complex validation, third-party integrations (Stripe, mailers), or a private service role key.

Below are the concrete schema suggestions, endpoint contracts, example implementations and local dev guidance so you can pick either option and get the frontend working end-to-end.

### Database: core table (company_profile) — example SQL

The repository includes `supabase_schema_clerk.sql` with a Postgres schema. If you need a minimal `company_profile` table for local testing, here's an example that matches the frontend fields and usage (assumptions noted below):

```sql
-- Minimal company_profile table (Postgres)
CREATE TABLE company_profile (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	owner_id uuid NOT NULL, -- references users.id (Clerk or Supabase user id)
	company_name text NOT NULL,
	website text,
	email text,
	phone text,
	address text,
	city text,
	state text,
	country text,
	postal_code text,
	industry_type text,
	company_type text,
	categories jsonb DEFAULT '[]'::jsonb,
	logo_url text,
	banner_url text,
	description text,
	is_verified boolean DEFAULT false,
	created_at timestamptz DEFAULT now(),
	updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_company_owner ON company_profile(owner_id);
CREATE INDEX idx_company_name ON company_profile((lower(company_name)));
```

Assumptions: the real `supabase_schema_clerk.sql` in this repo may include additional columns, triggers, and views. The example above is a compact, backwards-compatible subset suitable for local development or bootstrapping a Supabase project.

### Endpoint contracts (what the frontend expects)

- GET /api/company-profile/:userId
	- Purpose: return the company profile for the authenticated user.
	- Response: 200 with JSON company object when found, 404 when not found.
	- Example response:

```json
{
	"id": "b3f8a0d2-...",
	"owner_id": "user-id-123",
	"company_name": "TechCorp Solutions",
	"website": "https://techcorp.com",
	"logo_url": "https://res.cloudinary.com/.../logo.png",
	"banner_url": "https://res.cloudinary.com/.../banner.jpg",
	"description": "Leading technology company...",
	"categories": ["Web Development","Software Development"],
	"created_at": "2024-11-01T12:00:00.000Z"
}
```

- PUT /api/company-profile/:userId
	- Purpose: update the authenticated user's company profile (partial updates supported).
	- Request body: JSON with fields to update (company_name, website, address, categories, logo_url, etc.).
	- Response: 200 with updated object, or 400/403/500 on error.

### Minimal Express example (node) — server implementing the two endpoints

Save as `backend/index.js` (example). This is intentionally minimal to demonstrate the API shape.

```js
// backend/index.js
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// GET company profile by owner id
app.get('/api/company-profile/:userId', async (req, res) => {
	const { userId } = req.params
	try {
		const { rows } = await pool.query('SELECT * FROM company_profile WHERE owner_id = $1 LIMIT 1', [userId])
		if (!rows.length) return res.status(404).json({ message: 'Not found' })
		return res.json(rows[0])
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Internal error' })
	}
})

// PUT update company profile by owner id (partial update)
app.put('/api/company-profile/:userId', async (req, res) => {
	const { userId } = req.params
	const updates = req.body
	// defensive: only allow known fields
	const allowed = ['company_name','website','email','phone','address','city','state','country','postal_code','industry_type','company_type','categories','logo_url','banner_url','description']
	const set = []
	const values = []
	let i = 1
	for (const k of Object.keys(updates)) {
		if (!allowed.includes(k)) continue
		set.push(`${k} = $${i}`)
		values.push(updates[k])
		i++
	}
	if (!set.length) return res.status(400).json({ message: 'No valid fields to update' })
	values.push(userId)
	const q = `UPDATE company_profile SET ${set.join(',')}, updated_at = now() WHERE owner_id = $${i} RETURNING *`
	try {
		const { rows } = await pool.query(q, values)
		if (!rows.length) return res.status(404).json({ message: 'Not found' })
		res.json(rows[0])
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Internal error' })
	}
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('API listening on', PORT))
```

Install and run the example server locally:

```bash
cd backend
npm init -y
npm install express pg cors
set DATABASE_URL=postgres://user:pass@localhost:5432/comify  # Windows cmd
node index.js
```

Or use `nodemon` for development.

### Supabase notes (RLS, policies, migrations)

- If you use Supabase, run the `supabase_schema_clerk.sql` in the Supabase SQL editor to create tables, triggers and views included in that file.
- Use Row-Level Security (RLS) policies to restrict access so users can only read/update their own `company_profile` rows. Example policy (Supabase SQL):

```sql
-- Allow owners to select their profile
CREATE POLICY "select_own_profile" ON company_profile
FOR SELECT USING (owner_id = auth.uid());

-- Allow owners to update their profile
CREATE POLICY "update_own_profile" ON company_profile
FOR UPDATE USING (owner_id = auth.uid());
```

### Authentication & user identity

- The frontend uses Clerk identity (or Supabase auth depending on configuration). The backend should validate the authenticated user's id before returning or updating profiles. Two approaches:
	- If using Supabase Auth: use the Supabase JWT on the server or `auth.uid()` in RLS policies.
	- If using Clerk: validate Clerk sessions on the server (Clerk provides middleware / libraries) and extract the Clerk user ID, then use it as `owner_id`.

### Example curl usage

- Check profile (replace USER_ID):

```bash
curl -s http://localhost:5000/api/company-profile/USER_ID
```

- Update profile (partial):

```bash
curl -X PUT http://localhost:5000/api/company-profile/USER_ID \
	-H "Content-Type: application/json" \
	-d '{"company_name":"Example LLC","website":"https://example.com"}'
```

### Migrations & seeds

- Supabase: use the SQL editor or the CLI `supabase db push` to apply `supabase_schema_clerk.sql`.
- Postgres local: run the SQL file with `psql -f supabase_schema_clerk.sql -h localhost -U <user> -d <db>` or execute it from a migration tool (knex, prisma migrate, liquibase).
- Seed example (SQL):

```sql
INSERT INTO company_profile (owner_id, company_name, website, description, categories)
VALUES ('00000000-0000-0000-0000-000000000001','Example Co','https://example.com','Seeded company', '[]');
```

### Deployment

- Supabase: deploy your DB changes with the SQL editor and host functions via Supabase Edge Functions if needed.
- Node API: deploy to Vercel (Serverless functions), Heroku, Fly.io, Render, or any container host. Use environment variables for DATABASE_URL and secret keys. Use HTTPS and enforce authentication.

### Security notes

- Never expose service_role keys in client code. Use server-side endpoints or Supabase functions when you need elevated privileges.
- Validate and sanitize inputs server-side (the Express example filters allowed fields). Use parameterized SQL (pg prepared statements) to avoid SQL injection.

If you'd like, I can scaffold the Express backend with the two endpoints and a small README inside `backend/` so you can run it locally and test the Comify frontend end-to-end.

## Files & components of note

- `frontend/src/components/JobpilotDashboard.jsx` — the employer dashboard (Comify Dashboard) and sidebar navigation. Implements all the requested tabs and UI.
- `frontend/src/components/CompanyRegistrationForm.jsx` — 4-step company registration with Cloudinary uploads and Zod validation.
- `frontend/src/components/LandingPage.jsx` — marketing/hero + registration CTA and check for company profile.
- `frontend/src/components/CompanyProfile.jsx` — editable company profile view and save flow.
- `frontend/src/components/auth/*` — Clerk auth integration points and registration components.
- `frontend/src/components/ui/*` — UI primitives used across the app (card, button, input, select, tabs, file-upload, etc.).
- `supabase_schema_clerk.sql` — PostgreSQL schema for users and company_profile (used for reference / Supabase migrations).
- `CLAUDE.md` — added developer notes (AI/memory context file)
- `clerksetupguide.md` — Clerk onboarding notes
- `.gitignore` — updated to include `.github/`, `.env`, editor, OS files

## Troubleshooting & known issues

- Dashboard tabs appear to not work / UI stuck in loading
	- Cause: frontend depends on a backend endpoint `GET /api/company-profile/:userId`. If that endpoint returns 404 the UI will treat the company as missing and some flows will be blocked. Add that endpoint or mock it to allow the dashboard to load real data.

- SQL file linter / editor shows many syntax errors for `supabase_schema_clerk.sql`
	- Cause: your editor may be using the wrong SQL dialect (for example, SQL Server). The SQL file is PostgreSQL. Fix: set the file language to PostgreSQL in VS Code or add the provided `.vscode/settings.json` workspace association (already added) or install a PostgreSQL extension.

- PowerShell vs cmd differences
	- On Windows, `copy` is the cmd.exe copy command; PowerShell uses `cp`/`Copy-Item`. Use the correct copy/rename syntax for your shell.

## Development notes & TODOs

- Many dashboard pages use mock data (mockJobs, mockCandidates). The UI and CRUD controls are implemented but wiring them to a persistent backend is pending.
- Billing/Plans: UI is implemented with sample data; real payment integration (Stripe or similar) isn't implemented.
- Saved Candidates: UI exists; persistence and messaging flows need backend endpoints.
- Add a small `README-frontend.md` inside `frontend/` with exact commands if you want a more focused developer quickstart.

## Next recommended steps (low-risk)

1. Provide or mock the backend endpoints used by the frontend (GET/PUT /api/company-profile/:userId). This will immediately unblock the dashboard flows.
2. If using Supabase, run the SQL from `supabase_schema_clerk.sql` in your Supabase project to create the `company_profile` table and related objects.
3. Fill `frontend/.env` with Cloudinary and Supabase keys.
4. Run `cd frontend && npm install && npm run dev` and open the site to test flows.

## Want me to do more?

- I can create a `README-frontend.md` with exact commands and common troubleshooting steps.
- I can scaffold a minimal backend (Express + example endpoints) that implements the few APIs the frontend expects and run it on port 5000 for local testing.
- I can add Docker Compose to spin up a Postgres container and Adminer and wire a small seed migration from `supabase_schema_clerk.sql`.

Choose one of the options above and I will implement it next.
