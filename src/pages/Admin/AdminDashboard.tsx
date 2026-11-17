
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";

import {
  getApiSummary,
  subscribeToApiMetrics,
} from "../../monitoring/apiMonitor";

import "../../App.css";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(getApiSummary);

  // Subscribe to API monitoring updates
  useEffect(() => {
    setSummary(getApiSummary());

    const unsubscribe = subscribeToApiMetrics(() => {
      setSummary(getApiSummary());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app">
      <main className="dashboard">
        <div className="page-heading">
          <div>
            <h1>Administrator Dashboard</h1>

            <p>
              Manage and monitor the SupportDesk application.
            </p>

            <p>
              Welcome, <strong>{user?.name}</strong> (
              {user?.role})
            </p>
          </div>

          <div className="dashboard-actions">
            <Button
              variant="primary"
              onClick={() => navigate("/monitoring")}
            >
              Application Monitoring
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard")}
            >
              Customer Support
            </Button>

            <Button
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* API Monitoring Statistics */}
        <section className="stats-grid">
          <div className="card">
            <h2>Total API Requests</h2>
            <h2>{summary.total}</h2>
          </div>

          <div className="card">
            <h2>Successful Requests</h2>
            <h2>{summary.successful}</h2>
          </div>

          <div className="card">
            <h2>Failed Requests</h2>
            <h2>{summary.failed}</h2>
          </div>

          <div className="card">
            <h2>Average Response Time</h2>
            <h2>{summary.averageDuration} ms</h2>
          </div>
        </section>

        {/* Dashboard Navigation */}
        <section className="stats-grid">
          <div className="card">
            <h2>Application Monitoring</h2>

            <p>
              Monitor API requests, failures and response times.
            </p>

            <Button
              variant="primary"
              onClick={() => navigate("/monitoring")}
            >
              View Monitoring
            </Button>
          </div>

          <div className="card">
            <h2>Customer Support</h2>

            <p>
              View and manage customer support tickets.
            </p>

            <Button
              variant="primary"
              onClick={() => navigate("/dashboard")}
            >
              View Tickets
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
