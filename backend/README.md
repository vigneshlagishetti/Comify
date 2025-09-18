# Backend API Documentation

## Company Registration Backend - made by VINSA

This is a Node.js/Express.js backend API for the Company Registration System with Clerk authentication and automatic VINSA branding.

## Features

- 🔐 **Clerk Authentication Integration**
- 🏢 **Automatic VINSA Branding** (all company names get "- made by VINSA" appended)
- 📊 **Supabase Database Integration**
- 🔒 **Secure API Endpoints**
- 📝 **Input Validation**
- 🪝 **Clerk Webhooks Support**
- ⚡ **Rate Limiting**
- 🛡️ **Security Headers**
- 📋 **Comprehensive Error Handling**

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Supabase account and database
- Clerk account and application

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Environment Setup:**
Copy the `.env` file and update the required values:
- `CLERK_SECRET_KEY` - Get from Clerk Dashboard
- `SUPABASE_SERVICE_ROLE_KEY` - Get from Supabase Dashboard  
- `CLERK_WEBHOOK_SECRET` - Set up webhook in Clerk Dashboard
- `JWT_SECRET` - Generate a secure random string

3. **Start the server:**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/sync-user` - Sync user from Clerk to database
- `GET /api/auth/status` - Check authentication status

### User Routes (`/api/users`)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID (admin)
- `GET /api/users` - Get all users (admin)

### Company Routes (`/api/companies`)
- `POST /api/companies` - Create new company (auto VINSA branding)
- `GET /api/companies/my-company` - Get current user's company
- `PUT /api/companies/my-company` - Update current user's company
- `GET /api/companies/:id` - Get company by ID
- `GET /api/companies` - Get all companies (with filters)
- `PUT /api/companies/:id/verification` - Update verification status (admin)
- `GET /api/companies/search/:term` - Search companies

### Webhook Routes (`/api/webhooks`)
- `POST /api/webhooks/clerk` - Handle Clerk user events

## VINSA Branding Feature

🏷️ **All company names automatically get "- made by VINSA" appended**

This happens in two places:
1. **Company Creation** - When creating a new company via API
2. **Company Updates** - When updating company name via API

The branding is enforced at the database layer, ensuring consistency.

## Authentication

All API endpoints (except webhooks and health check) require a valid Clerk JWT token:

```javascript
Headers: {
  'Authorization': 'Bearer <clerk-jwt-token>'
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": ["Additional error details"],
  "timestamp": "2025-09-18T10:30:00.000Z",
  "path": "/api/endpoint",
  "method": "POST"
}
```

## Validation

Request validation is handled by Joi schemas:

- **Company Creation**: All fields required, VINSA branding auto-applied
- **Company Updates**: Partial updates allowed, VINSA branding maintained
- **User Updates**: Profile fields with proper validation

## Rate Limiting

- **100 requests per 15 minutes** per IP address
- Applied to all `/api/*` routes
- Configurable via environment variables

## Security Features

- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Request validation
- ✅ JWT token verification
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ Error logging

## Database Schema

The API works with these Supabase tables:

### Users Table
```sql
- id (uuid, primary key)
- clerk_id (text, unique)
- email (text)
- full_name (text)
- mobile_no (text)
- gender (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### Companies Table
```sql
- id (uuid, primary key)
- owner_id (uuid, foreign key to users)
- company_name (text) -- Auto-appends "- made by VINSA"
- company_type (text)
- industry (text)
- employee_count (text)
- address (text)
- city (text)
- state (text)
- pincode (text)
- company_description (text)
- website (text)
- verification_status (text)
- verification_notes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

## Development

```bash
# Start with auto-reload
npm run dev

# Run tests
npm test

# Check API health
curl http://localhost:5000/health
```

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Configure all required environment variables
3. Set up Clerk webhooks pointing to your domain
4. Configure CORS for your frontend domain
5. Set up SSL/TLS certificates
6. Configure rate limiting for production traffic

## Architecture

```
Frontend (React + Clerk) 
    ↓ (JWT tokens)
Backend API (Express.js)
    ↓ (Service role key)
Supabase Database
    ↑ (Webhooks)
Clerk Authentication
```

## Support

Created by **VINSA** - Your Company Registration Solution

For issues or questions, check the logs or contact the development team.