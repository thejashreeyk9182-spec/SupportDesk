
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

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

    return unsubscribe;
  }, []);

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Navigation
  const handleMonitoring = () => {
    navigate("/monitoring");
  };

  const handleTickets = () => {
    navigate("/dashboard");
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
              onClick={handleMonitoring}
            >
              Application Monitoring
            </Button>

            <Button
              variant="secondary"
              onClick={handleTickets}
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
          <Card title="Total API Requests">
            <h2>{summary.total}</h2>
          </Card>

          <Card title="Successful Requests">
            <h2>{summary.successful}</h2>
          </Card>

          <Card title="Failed Requests">
            <h2>{summary.failed}</h2>
          </Card>

          <Card title="Average Response Time">
            <h2>{summary.averageDuration} ms</h2>
          </Card>
        </section>

        {/* Dashboard Navigation */}
        <section className="stats-grid">
          <Card title="Application Monitoring">
            <p>
              Monitor API requests, failures and response times.
            </p>

            <Button
              variant="primary"
              onClick={handleMonitoring}
            >
              View Monitoring
            </Button>
          </Card>

          <Card title="Customer Support">
            <p>
              View and manage customer support tickets.
            </p>

            <Button
              variant="primary"
              onClick={handleTickets}
            >
              View Tickets
            </Button>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
