
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

const Login = lazy(() => import("./pages/Login/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
