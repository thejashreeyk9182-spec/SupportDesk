
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Unauthorized from "../pages/Unauthorized/Unauthorized";

import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

import { useAuth } from "../hooks/useAuth";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />

      {/* Login route */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Admin-only route */}
        <Route element={
          <RoleBasedRoute allowedRoles={["ADMIN"]} />
        }>
          <Route
            path="/admin"
            element={<h1>Administrator Dashboard</h1>}
          />
        </Route>

        {/* Unauthorized page */}
        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />
      </Route>

      {/* Invalid route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
