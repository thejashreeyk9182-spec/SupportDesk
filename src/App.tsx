
import { Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import PageLoader from "./components/common/PageLoader";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
