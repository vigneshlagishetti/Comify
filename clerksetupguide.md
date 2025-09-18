# Clerk Setup Guide

This guide documents the Clerk setup steps used or expected by the project (Comify). It focuses on front-end integration (publishable key), redirect configuration, and general tips.

1. Create a Clerk account
   - Visit https://clerk.com and create an organization/project.

2. Configure the application
   - Add application origins and redirect URLs used by the project. For local development add:
     - `http://localhost:5173`
     - `http://localhost:3000`

3. Get publishable key
   - From the Clerk dashboard, copy the **Publishable key** and set it in the frontend `.env` as:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

4. Optional: JWT & Backend
   - If your backend needs to verify Clerk sessions, fetch session tokens from the front-end and verify them in your backend using Clerk SDK and your Clerk API key (server-side secret).

5. Integrations
   - If you use social login providers via Clerk, configure them in the Clerk dashboard and ensure redirect URIs match the app configuration.

6. Local dev tips
   - If you're running the frontend on a different port than Clerk's configured origin, add that origin in Clerk.
   - Use the browser’s devtools to inspect Clerk cookies and session behavior when debugging.

Security
--------
- Keep server-side Clerk API keys in secure secret storage; do not commit them to source control.

Troubleshooting
---------------
- If sign-in fails, check allowed origins and redirect URLs in the Clerk dashboard.
- If sessions are not persisted, check cookie settings and sameSite configurations.
