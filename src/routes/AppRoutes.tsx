
import { lazy } from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

import { useAuth } from "../hooks/useAuth";

// Lazy-loaded pages
const Login = lazy(() => import("../pages/Login/Login"));

const Dashboard = lazy(
  () => import("../pages/Dashboard/Dashboard")
);

const AdminDashboard = lazy(
  () => import("../pages/Admin/AdminDashboard")
);

const Unauthorized = lazy(
  () => import("../pages/Unauthorized/Unauthorized")
);

const MonitoringDashboard = lazy(
  () => import("../monitoring/MonitoringDashboard")
);

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Admin-only routes */}
        <Route
          element={
            <RoleBasedRoute allowedRoles={["ADMIN"]} />
          }
        >
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/monitoring"
            element={<MonitoringDashboard />}
          />
        </Route>

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
