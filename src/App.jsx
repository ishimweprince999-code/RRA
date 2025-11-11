import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import LoginPage from './pages/Auth/LoginPage.jsx'
import AdminLoginPage from './pages/Admin/LoginPage.jsx'
import RegisterPage from './pages/Auth/RegisterPage.jsx'
import TraderLayout from './layouts/TraderLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import TraderDashboard from './pages/Trader/Dashboard.jsx'
import NewSale from './pages/Trader/NewSale.jsx'
import Transactions from './pages/Trader/Transactions.jsx'
import Reports from './pages/Trader/Reports.jsx'
import AdminDashboard from './pages/Admin/Dashboard.jsx'
import AdminHierarchyManagement from './pages/Admin/AdminHierarchyManagement.jsx'
import TradersList from './pages/Admin/TradersList.jsx'
import TaxesOverview from './pages/Admin/TaxesOverview.jsx'
import Analytics from './pages/Admin/Analytics.jsx'
import AdminNotifications from './pages/Admin/Notifications.jsx'
import SystemHealth from './pages/Admin/SystemHealth.jsx'
import AdminProfile from './pages/Admin/AdminProfile.jsx'
import AdminSettings from './pages/Admin/AdminSettings.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import Logout from './pages/Logout.jsx'
import Error404 from './pages/Error404.jsx'
import Error500 from './pages/Error500.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute allowedRoles={["trader"]} />}>
        <Route element={<TraderLayout />}>
          <Route path="/trader" element={<Navigate to="/trader/dashboard" replace />} />
          <Route path="/trader/dashboard" element={<TraderDashboard />} />
          <Route path="/trader/new-sale" element={<NewSale />} />
          <Route path="/trader/transactions" element={<Transactions />} />
          <Route path="/trader/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/hierarchy" element={<AdminHierarchyManagement />} />
          <Route path="/admin/traders" element={<TradersList />} />
          <Route path="/admin/taxes" element={<TaxesOverview />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/system-health" element={<SystemHealth />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="/500" element={<Error500 />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  )
}
