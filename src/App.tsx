
import { Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading page...</div>}>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
