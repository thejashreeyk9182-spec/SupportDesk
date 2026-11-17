
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./styles/design-tokens.css";

import App from "./App";
import { store } from "./app/store";
import { AuthProvider } from "./context/AuthContext";

import { startPerformanceMonitoring } from "./monitoring/performanceMonitor";
import { registerGlobalErrorHandlers } from "./monitoring/globalErrorHandler";

import "./index.css";

// Start application monitoring
startPerformanceMonitoring();
registerGlobalErrorHandlers();

// Render React application
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
