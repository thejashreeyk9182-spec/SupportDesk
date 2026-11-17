
import { useEffect, useState } from "react";

import {
  getApiMetrics,
  getApiSummary,
  subscribeToApiMetrics,
  type ApiMetric,
} from "./apiMonitor";

import {
  getPerformanceMetrics,
  subscribeToPerformanceMetrics,
  type PerformanceMetric,
} from "./performanceMonitor";

import {
  getReportedErrors,
  subscribeToReportedErrors,
  type ReportedError,
} from "./errorReporter";

import "../App.css";

function MonitoringDashboard() {
  const [apiMetrics, setApiMetrics] = useState<ApiMetric[]>(
    () => getApiMetrics()
  );

  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetric[]>(() =>
      getPerformanceMetrics()
    );

  const [applicationErrors, setApplicationErrors] =
    useState<ReportedError[]>(() => getReportedErrors());

  useEffect(() => {
    const unsubscribeApi = subscribeToApiMetrics((metrics) => {
      setApiMetrics(metrics);
    });

    const unsubscribePerformance =
      subscribeToPerformanceMetrics((metrics) => {
        setPerformanceMetrics(metrics);
      });

    const unsubscribeErrors = subscribeToReportedErrors(
      (errors) => {
        setApplicationErrors(errors);
      }
    );

    return () => {
      unsubscribeApi();
      unsubscribePerformance();
      unsubscribeErrors();
    };
  }, []);

  const summary = getApiSummary();

  return (
    <main className="dashboard monitoring-dashboard">
      <div className="page-heading">
        <div>
          <h1>Application Monitoring</h1>
          <p>
            Monitor API requests, application errors and performance.
          </p>
        </div>
      </div>

      {/* API statistics */}
      <section className="stats-grid">
        <div className="card">
          <h3>Total API Requests</h3>
          <h2>{summary.total}</h2>
        </div>

        <div className="card">
          <h3>Successful Requests</h3>
          <h2>{summary.successful}</h2>
        </div>

        <div className="card">
          <h3>Failed Requests</h3>
          <h2>{summary.failed}</h2>
        </div>

        <div className="card">
          <h3>Average Response Time</h3>
          <h2>{summary.averageDuration} ms</h2>
        </div>
      </section>

      {/* Recent API activity */}
      <section className="ticket-section">
        <h2>Recent API Activity</h2>

        {apiMetrics.length === 0 ? (
          <p>No API requests recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Result</th>
                </tr>
              </thead>

              <tbody>
                {apiMetrics.map((metric) => (
                  <tr key={metric.id}>
                    <td>{metric.endpoint}</td>
                    <td>{metric.method}</td>
                    <td>{String(metric.status)}</td>
                    <td>{metric.duration} ms</td>
                    <td>
                      {metric.success ? "Success" : "Failed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Performance measurements */}
      <section className="ticket-section">
        <h2>Performance Measurements</h2>

        {performanceMetrics.length === 0 ? (
          <p>No performance measurements recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Measurement</th>
                  <th>Value</th>
                  <th>Timestamp</th>
                </tr>
              </thead>

              <tbody>
                {performanceMetrics.map((metric, index) => (
                  <tr key={`${metric.name}-${metric.timestamp}-${index}`}>
                    <td>{metric.name}</td>
                    <td>
                      {metric.duration}
                      {metric.unit === "score" ? "" : " ms"}
                    </td>
                    <td>
                      {new Date(metric.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent application errors */}
      <section className="ticket-section">
        <h2>Recent Application Errors</h2>

        {applicationErrors.length === 0 ? (
          <p>No application errors recorded.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Error Message</th>
                  <th>Source</th>
                  <th>Timestamp</th>
                </tr>
              </thead>

              <tbody>
                {applicationErrors.map((error) => (
                  <tr key={error.id}>
                    <td>{error.message}</td>
                    <td>{error.source}</td>
                    <td>
                      {new Date(error.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default MonitoringDashboard;
