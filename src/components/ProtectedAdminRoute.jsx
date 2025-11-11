import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../store/auth.js";
import useAdminHierarchy from "../store/adminHierarchy.js";

export default function ProtectedAdminRoute({ 
  requiredLevel, 
  requiredJurisdiction, 
  children 
}) {
  const { token, role, adminLevel, jurisdiction } = useAuth();
  const { canAccessJurisdiction } = useAdminHierarchy();
  const location = useLocation();

  // Check if user is authenticated and is an admin
  if (!token || role !== "admin") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check admin level permissions
  if (requiredLevel) {
    const levelHierarchy = {
      'national': 4,
      'provincial': 3, 
      'district': 2,
      'sector': 1
    };
    
    const userLevelRank = levelHierarchy[adminLevel] || 0;
    const requiredLevelRank = levelHierarchy[requiredLevel] || 0;
    
    // User must have equal or higher level than required
    if (userLevelRank < requiredLevelRank) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // Check jurisdiction permissions
  if (requiredJurisdiction && adminLevel && jurisdiction) {
    if (!canAccessJurisdiction(
      { level: adminLevel, ...jurisdiction }, 
      requiredJurisdiction.type, 
      requiredJurisdiction.id
    )) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children ? children : <Outlet />;
}
