# AiBigo Client - React Frontend

React frontend application for AiBigo Education Platform with Redux state management.

## Features

- **Authentication**: Login, Register, Forgot Password, Reset Password
- **Platform Admin Dashboard**: Complete admin panel with all CRUD operations
- **Role-Based Access Control**: Protected routes based on user roles
- **Redux State Management**: Centralized state with Redux Toolkit
- **Material-UI**: Modern and responsive UI components
- **API Integration**: Full integration with backend APIs

## Tech Stack

- React 18
- Redux Toolkit
- React Router v6
- Material-UI (MUI)
- Axios
- React Toastify

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional, defaults to localhost:3000):
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3001`

## Project Structure

```
src/
├── components/          # Reusable components
│   └── routing/        # Route guards
├── layouts/            # Layout components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   └── platform-admin/ # Platform admin pages
├── services/           # API services
│   └── api/            # API endpoints
├── store/              # Redux store
│   ├── slices/         # Redux slices
│   └── store.js        # Store configuration
└── App.jsx             # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication

### Login Credentials (after seeding backend)

**Platform Admin:**
- Email: `platformadmin@email.com`
- Password: `platformAdmin123`

**Student (self-registered):**
- Register at `/register`
- Role automatically set to `STUDENT`

## Routes

### Public Routes
- `/login` - Login page
- `/register` - Student registration
- `/forgot-password` - Password reset request
- `/reset-password/:token` - Password reset

### Platform Admin Routes (Protected)
- `/platform-admin/dashboard` - Dashboard overview
- `/platform-admin/academics/universities` - Manage universities
- `/platform-admin/academics/programs` - Manage programs
- `/platform-admin/academics/subjects` - Manage subjects
- `/platform-admin/academics/chapters` - Manage chapters
- `/platform-admin/engagement/opportunities` - Manage opportunities
- `/platform-admin/engagement/industry-partners` - Manage industry partners
- `/platform-admin/engagement/assessments` - Manage assessments
- `/platform-admin/institutes` - Manage institutes
- `/platform-admin/business/subscription-plans` - Manage subscription plans
- `/platform-admin/system/admin-users` - Manage admin users
- `/platform-admin/system/audit-logs` - View audit logs

## API Integration

All API calls are handled through Redux thunks in the store slices. The API base URL is configured in `src/services/api/axios.js`.

### API Services

- `auth.js` - Authentication endpoints
- `platformAdmin.js` - Dashboard endpoints
- `academics.js` - Academic management endpoints
- `engagement.js` - Engagement endpoints
- `institutes.js` - Institute endpoints
- `business.js` - Business endpoints
- `system.js` - System administration endpoints

## State Management

The app uses Redux Toolkit for state management with the following slices:

- `authSlice` - Authentication state
- `platformAdminSlice` - Dashboard data
- `academicsSlice` - Academic data
- `engagementSlice` - Engagement data
- `institutesSlice` - Institute data
- `businessSlice` - Business data
- `systemSlice` - System data

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:3000/api/v1`)

## Notes

- All protected routes require authentication
- Platform Admin routes require `PLATFORM_ADMIN` role
- JWT tokens are stored in localStorage
- Automatic logout on 401 responses
- Toast notifications for user feedback
