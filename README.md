# aibigo-client

React frontend application for the AiBigo Education Platform. A modern, responsive web application built with React, Redux Toolkit, and Material-UI.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Routing](#routing)
- [Authentication](#authentication)
- [Components](#components)
- [Styling](#styling)
- [Environment Variables](#environment-variables)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🛠 Tech Stack

- **React** 18.2+
- **Redux Toolkit** 2.0+ - State management
- **React Router** 6.20+ - Client-side routing
- **Material-UI (MUI)** 5.15+ - UI component library
- **Axios** 1.6+ - HTTP client
- **React Toastify** 9.1+ - Toast notifications
- **Vite** 5.0+ - Build tool and dev server

## ✨ Features

- 🔐 **Authentication** - Login, Register, Password Reset
- 📊 **Dashboard** - Platform admin dashboard with statistics
- 📚 **Academic Management** - Universities, Programs, Subjects, Chapters
- 🤝 **Engagement** - Opportunities, Industry Partners, Assessments, Courses
- 🏢 **Institute Management** - Multi-tenant institute support
- 💼 **Business Operations** - Subscription Plans, Payments
- ⚙️ **System Administration** - Admin users, Platform settings, Analytics
- 📝 **Audit Logs** - View and filter audit logs
- 📥 **Log Management** - View and download application logs
- 🎨 **Material-UI** - Modern, responsive design
- ⚡ **Optimized** - Request caching, deduplication, error handling
- 🔒 **Protected Routes** - Role-based route protection

## 📦 Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- **Backend Server** running (see aibigo-server README)

## 🚀 Installation

1. **Clone the repository** (if not already cloned):
```bash
git clone <repository-url>
cd aibigo-client
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env` file** (optional, defaults to localhost:3000):
```bash
# Create .env file
touch .env
```

4. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

**Development:**
```env
# Backend API URL (local development)
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

**Production:**
```env
# Backend API URL (Vercel production)
VITE_API_BASE_URL=https://aibigo-server.vercel.app/api/v1
```

**Note**: If `VITE_API_BASE_URL` is not set, the app automatically uses:
- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://aibigo-server.vercel.app/api/v1`

**Note**: 
- Vite requires the `VITE_` prefix for environment variables to be exposed to the client
- If `VITE_API_BASE_URL` is not set, the app automatically uses:
  - **Development**: `http://localhost:3000/api/v1`
  - **Production**: `https://aibigo-server.vercel.app/api/v1`

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:3001` (Vite default port)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Access the Application

- **Local Development**: http://localhost:3001
- **Login Page**: http://localhost:3001/login

## 📁 Project Structure

```
aibigo-client/
├── public/                    # Static assets
├── src/
│   ├── components/           # Reusable components
│   │   └── routing/
│   │       └── PrivateRoute.jsx  # Route protection
│   ├── layouts/              # Layout components
│   │   └── PlatformAdminLayout.jsx  # Main admin layout
│   ├── pages/                # Page components
│   │   ├── auth/             # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   └── platform-admin/   # Platform admin pages
│   │       ├── Dashboard.jsx
│   │       ├── academics/    # Academic management
│   │       │   ├── Universities.jsx
│   │       │   ├── Programs.jsx
│   │       │   ├── Subjects.jsx
│   │       │   └── Chapters.jsx
│   │       ├── engagement/   # Engagement features
│   │       │   ├── Opportunities.jsx
│   │       │   ├── IndustryPartners.jsx
│   │       │   ├── Assessments.jsx
│   │       │   └── Courses.jsx
│   │       ├── business/     # Business operations
│   │       │   ├── SubscriptionPlans.jsx
│   │       │   └── Payments.jsx
│   │       ├── system/       # System administration
│   │       │   ├── AdminUsers.jsx
│   │       │   ├── PlatformSettings.jsx
│   │       │   ├── Analytics.jsx
│   │       │   ├── AuditLogs.jsx
│   │       │   └── Logs.jsx
│   │       └── Institutes.jsx
│   ├── services/             # API services
│   │   └── api/
│   │       ├── axios.js       # Axios instance with interceptors
│   │       ├── auth.js         # Authentication APIs
│   │       ├── platformAdmin.js
│   │       ├── academics.js
│   │       ├── engagement.js
│   │       ├── institutes.js
│   │       ├── business.js
│   │       ├── system.js
│   │       └── logs.js
│   ├── store/                 # Redux store
│   │   ├── slices/            # Redux slices
│   │   │   ├── authSlice.js
│   │   │   ├── platformAdminSlice.js
│   │   │   ├── academicsSlice.js
│   │   │   ├── engagementSlice.js
│   │   │   ├── institutesSlice.js
│   │   │   ├── businessSlice.js
│   │   │   ├── systemSlice.js
│   │   │   └── logsSlice.js
│   │   └── store.js           # Store configuration
│   ├── utils/                 # Utility functions
│   │   └── cacheUtils.js      # Cache management
│   ├── App.jsx                # Main app component with routes
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── .env                       # Environment variables
├── package.json
├── vite.config.js             # Vite configuration
└── README.md
```

## 🔄 State Management

### Redux Toolkit

The application uses Redux Toolkit for centralized state management.

### Redux Slices

1. **authSlice** - Authentication state
   - User data
   - Access/refresh tokens
   - Authentication status

2. **platformAdminSlice** - Dashboard data
   - Dashboard overview statistics

3. **academicsSlice** - Academic data
   - Universities, Programs, Subjects, Chapters

4. **engagementSlice** - Engagement data
   - Opportunities, Industry Partners, Assessments, Courses

5. **institutesSlice** - Institute data
   - Institutes list

6. **businessSlice** - Business data
   - Subscription Plans, Payments

7. **systemSlice** - System data
   - Admin Users, Platform Settings, Analytics, Audit Logs

8. **logsSlice** - Log management
   - Log files, Recent logs, Statistics

### Using Redux in Components

```jsx
import { useSelector, useDispatch } from 'react-redux'
import { getDashboardOverview } from '../store/slices/platformAdminSlice'

function Dashboard() {
  const dispatch = useDispatch()
  const { dashboardOverview, loading, error } = useSelector(state => state.platformAdmin)

  useEffect(() => {
    dispatch(getDashboardOverview())
  }, [dispatch])

  // Component logic...
}
```

## 🔌 API Integration

### Axios Configuration

All API calls go through a configured Axios instance (`src/services/api/axios.js`):

- **Base URL**: Configured via `VITE_API_BASE_URL`
- **Authentication**: Token automatically added to requests
- **Request Caching**: 30-second cache for GET requests
- **Request Deduplication**: Prevents duplicate concurrent requests
- **Error Handling**: Automatic 401 logout, error messages

### API Services

API services are organized by feature:
- `auth.js` - Authentication endpoints
- `platformAdmin.js` - Dashboard endpoints
- `academics.js` - Academic management
- `engagement.js` - Engagement features
- `institutes.js` - Institute management
- `business.js` - Business operations
- `system.js` - System administration
- `logs.js` - Log management

### Making API Calls

```jsx
import { getUniversities } from '../store/slices/academicsSlice'
import { useDispatch } from 'react-redux'

function Universities() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(getUniversities())
  }, [dispatch])
}
```

### Response Handling

Redux slices automatically handle:
- Direct data: `{ ...data }`
- Wrapped data: `{ success: true, data: { ...data } }`
- Error responses
- Loading states

## 🛣 Routing

### Public Routes

- `/login` - Login page
- `/register` - Student registration
- `/forgot-password` - Password reset request
- `/reset-password/:token` - Password reset with token

### Protected Routes

All routes under `/platform-admin/*` require:
- Authentication (valid JWT token)
- `PLATFORM_ADMIN` role

### Route Structure

```
/platform-admin
├── /dashboard                    # Dashboard overview
├── /academics
│   ├── /universities            # Manage universities
│   ├── /programs                # Manage programs
│   ├── /subjects                # Manage subjects
│   └── /chapters                # Manage chapters
├── /engagement
│   ├── /opportunities           # Manage opportunities
│   ├── /industry-partners       # Manage industry partners
│   ├── /assessments             # Manage assessments
│   └── /courses                 # Manage courses
├── /institutes                   # Manage institutes
├── /business
│   ├── /subscription-plans     # Manage subscription plans
│   └── /payments                # Manage payments
└── /system
    ├── /admin-users             # Manage admin users
    ├── /platform-settings       # Platform settings
    ├── /analytics               # Analytics triggers
    ├── /audit-logs              # View audit logs
    └── /logs                    # View application logs
```

### Route Protection

Routes are protected using `PrivateRoute` component:

```jsx
<Route
  path="/platform-admin"
  element={
    <PrivateRoute allowedRoles={['PLATFORM_ADMIN']}>
      <PlatformAdminLayout />
    </PrivateRoute>
  }
>
  {/* Child routes */}
</Route>
```

## 🔐 Authentication

### Login Flow

1. User enters credentials
2. `POST /auth/login` API call
3. Receive `accessToken`, `refreshToken`, and `user` data
4. Store tokens in localStorage
5. Update Redux state
6. Redirect based on user role

### Token Management

- **Storage**: Tokens stored in `localStorage`
- **Expiry**: Access token expires in 24 hours
- **Auto-logout**: On 401 response, user is logged out
- **Token Refresh**: Not implemented yet (future enhancement)

### Test Credentials

After seeding the backend:

**Platform Admin:**
- Email: `platformadmin@email.com`
- Password: `platformAdmin123`

**Students:**
- Register at `/register`
- Role automatically set to `STUDENT`

## 🧩 Components

### Layout Components

- **PlatformAdminLayout** - Main admin layout with:
  - Navigation drawer
  - Header with user info
  - Logout functionality
  - Responsive design

### Page Components

All pages follow a similar structure:
- Loading states
- Error handling
- Data display (tables/cards)
- Create/Edit forms (where applicable)

### Reusable Components

- **PrivateRoute** - Route protection component
- Material-UI components used throughout

## 🎨 Styling

### Material-UI Theme

Custom theme configured in `src/main.jsx`:
- Primary color: Blue (#1976d2)
- Secondary color: Pink (#dc004e)
- Responsive breakpoints
- Dark mode support (can be added)

### Global Styles

- `src/index.css` - Global CSS
- Material-UI components styled via theme
- Responsive design with MUI Grid system

## 🔧 Environment Variables

### Development

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Production

```env
VITE_API_BASE_URL=https://aibigo-server.vercel.app/api/v1
```

**Default Behavior**: If `VITE_API_BASE_URL` is not set:
- **Development mode**: Uses `http://localhost:3000/api/v1`
- **Production mode**: Uses `https://aibigo-server.vercel.app/api/v1`

**Important**: 
- Vite only exposes variables prefixed with `VITE_` to the client
- The app automatically detects production mode and uses the Vercel URL
- You can override by setting `VITE_API_BASE_URL` in your `.env` file

## 🏗 Building for Production

### Build Command

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

### Build Output

- **Output Directory**: `dist/`
- **Assets**: Optimized and minified
- **Code Splitting**: Automatic code splitting for optimal loading

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository** to Vercel
2. **Configure Build Settings**:
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Framework Preset**: Vite

3. **Set Environment Variables** (optional):
   - `VITE_API_BASE_URL` - Backend API URL (defaults to `https://aibigo-server.vercel.app/api/v1` in production)
   
   **Note**: If not set, the app automatically uses the Vercel production URL (`https://aibigo-server.vercel.app/api/v1`) in production builds.

4. **Deploy**: Vercel auto-deploys on push to main branch

### Other Deployment Options

- **Netlify**: Similar to Vercel
- **AWS Amplify**: AWS hosting
- **GitHub Pages**: Static hosting (requires build adjustments)

## 🐛 Troubleshooting

### API Connection Issues

**Error**: `Network Error` or `Failed to fetch`

**Solutions**:
1. Verify backend server is running
2. Check `VITE_API_BASE_URL` in `.env`
3. Check CORS configuration on backend
4. Verify network connectivity

### Authentication Issues

**Error**: `401 Unauthorized`

**Solutions**:
1. Token may be expired (24 hours)
2. Re-login to get new token
3. Check if token is in localStorage
4. Verify backend JWT_SECRET matches

### Data Not Loading

**Issue**: Pages show loading but no data

**Solutions**:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify Redux state in Redux DevTools
4. Check API response structure
5. Verify user has correct role/permissions

### Build Errors

**Error**: Build fails

**Solutions**:
1. Check for TypeScript/ESLint errors
2. Verify all dependencies installed
3. Check Node.js version (18+)
4. Clear `node_modules` and reinstall

### CORS Errors

**Error**: `Access-Control-Allow-Origin`

**Solutions**:
1. Verify backend CORS is configured
2. Check `FRONTEND_URL` in backend `.env`
3. Verify API base URL is correct
4. Check browser console for specific error

## 📚 Additional Resources

### Redux DevTools

Install Redux DevTools browser extension:
- **Chrome**: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
- **Firefox**: [Redux DevTools](https://addons.mozilla.org/firefox/addon/reduxdevtools/)

### Material-UI Documentation

- **MUI Components**: https://mui.com/components/
- **MUI Icons**: https://mui.com/material-ui/material-icons/

### React Router Documentation

- **React Router v6**: https://reactrouter.com/

## 📝 Notes

- **Request Caching**: GET requests are cached for 30 seconds
- **Request Deduplication**: Duplicate concurrent requests are deduplicated
- **Error Handling**: Automatic logout on 401, toast notifications for errors
- **Loading States**: All async operations show loading indicators
- **Responsive Design**: Mobile-friendly with Material-UI responsive breakpoints

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Check Network tab for API issues
4. Verify Redux state in Redux DevTools
5. Review backend server logs

## 📄 License

ISC
