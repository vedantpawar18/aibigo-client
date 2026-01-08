# Quick Start Guide

## Prerequisites

1. Node.js (v16 or higher)
2. Backend server running on `http://localhost:3000`

## Installation

```bash
cd aibigo/aibigo-client
npm install
```

## Configuration

The app is configured to connect to `http://localhost:3000/api/v1` by default. You can override this by creating a `.env` file:

```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Running the Application

```bash
npm run dev
```

The app will start on `http://localhost:3001`

## Testing Login

After seeding the backend database, use these credentials:

**Platform Admin:**
- Email: `platformadmin@email.com`
- Password: `platformAdmin123`

## Features Implemented

✅ Authentication (Login, Register, Forgot Password, Reset Password)
✅ Platform Admin Dashboard
✅ Universities Management
✅ Programs Management
✅ Subjects Management
✅ Chapters Management
✅ Opportunities Management
✅ Industry Partners Management
✅ Assessments Management
✅ Institutes Management
✅ Subscription Plans Management
✅ Admin Users Management
✅ Audit Logs Viewing

## Project Structure

- `src/pages/` - All page components
- `src/store/slices/` - Redux slices for state management
- `src/services/api/` - API service functions
- `src/components/` - Reusable components
- `src/layouts/` - Layout components

## Next Steps

1. Start the backend server
2. Seed the database (`npm run seed:all` in backend)
3. Start the frontend (`npm run dev`)
4. Navigate to `http://localhost:3001`
5. Login with platform admin credentials
