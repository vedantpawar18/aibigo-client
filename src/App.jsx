import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import PlatformAdminLayout from './layouts/PlatformAdminLayout'
import Dashboard from './pages/platform-admin/Dashboard'
import Universities from './pages/platform-admin/academics/Universities'
import Programs from './pages/platform-admin/academics/Programs'
import Subjects from './pages/platform-admin/academics/Subjects'
import Chapters from './pages/platform-admin/academics/Chapters'
import Opportunities from './pages/platform-admin/engagement/Opportunities'
import IndustryPartners from './pages/platform-admin/engagement/IndustryPartners'
import Assessments from './pages/platform-admin/engagement/Assessments'
import Courses from './pages/platform-admin/engagement/Courses'
import Institutes from './pages/platform-admin/Institutes'
import SubscriptionPlans from './pages/platform-admin/business/SubscriptionPlans'
import Payments from './pages/platform-admin/business/Payments'
import AdminUsers from './pages/platform-admin/system/AdminUsers'
import PlatformSettings from './pages/platform-admin/system/PlatformSettings'
import Analytics from './pages/platform-admin/system/Analytics'
import AuditLogs from './pages/platform-admin/system/AuditLogs'
import PrivateRoute from './components/routing/PrivateRoute'

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/platform-admin/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/platform-admin/dashboard" /> : <Register />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Platform Admin Routes */}
      <Route
        path="/platform-admin"
        element={
          <PrivateRoute allowedRoles={['PLATFORM_ADMIN']}>
            <PlatformAdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Academics */}
        <Route path="academics/universities" element={<Universities />} />
        <Route path="academics/programs" element={<Programs />} />
        <Route path="academics/subjects" element={<Subjects />} />
        <Route path="academics/chapters" element={<Chapters />} />
        
        {/* Engagement */}
        <Route path="engagement/opportunities" element={<Opportunities />} />
        <Route path="engagement/industry-partners" element={<IndustryPartners />} />
        <Route path="engagement/assessments" element={<Assessments />} />
        <Route path="engagement/courses" element={<Courses />} />
        
        {/* Institutes */}
        <Route path="institutes" element={<Institutes />} />
        
        {/* Business */}
        <Route path="business/subscription-plans" element={<SubscriptionPlans />} />
        <Route path="business/payments" element={<Payments />} />
        
        {/* System */}
        <Route path="system/admin-users" element={<AdminUsers />} />
        <Route path="system/platform-settings" element={<PlatformSettings />} />
        <Route path="system/analytics" element={<Analytics />} />
        <Route path="system/audit-logs" element={<AuditLogs />} />
      </Route>

      {/* Default redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role === 'PLATFORM_ADMIN'
                  ? '/platform-admin/dashboard'
                  : user?.role === 'OPERATIONS_ADMIN'
                  ? '/ops/dashboard'
                  : user?.role === 'FACULTY'
                  ? '/faculty/dashboard'
                  : '/student/home'
              }
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  )
}

export default App
