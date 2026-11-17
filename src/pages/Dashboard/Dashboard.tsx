
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import TicketTable from "../../components/TicketTable/TicketTable";
import TicketForm from "../../components/TicketForm/TicketForm";
import Pagination from "../../components/Pagination/Pagination";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import Alert from "../../components/common/Alert";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

import { useReduxTickets } from "../../hooks/useReduxTickets";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import useToggle from "../../hooks/useToggle";

import {
  measurePerformance,
  startPerformanceMeasurement,
} from "../../monitoring/performanceMonitor";

import type {
  Ticket,
  TicketFormData,
} from "../../types/ticket.types";

import "../../App.css";

const PAGE_SIZE = 5;

function Dashboard() {
  const { user, logout } = useAuth();
  const { can } = usePermissions();
  const navigate = useNavigate();

  // Dashboard performance measurement
  useEffect(() => {
    const startTime = startPerformanceMeasurement();

    measurePerformance(
      "Dashboard Mounted",
      startTime
    );

    return () => {
      measurePerformance(
        "Dashboard Unmounted",
        startTime
      );
    };
  }, []);

  const {
    tickets,
    loading,
    error,
    total,
    params,
    updateParams,
    create,
    update,
    remove,
    bulkUpdateStatus,
    isBulkUpdating,
    refetch,
  } = useReduxTickets();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const {
    value: showForm,
    setTrue: openForm,
    setFalse: closeForm,
  } = useToggle(false);

  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  const [selectedTicketIds, setSelectedTicketIds] =
    useState<string[]>([]);

  const [bulkStatus, setBulkStatus] =
    useState<Ticket["status"]>("In Progress");

  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkError, setBulkError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  // Role and permission checks
  const isManager = user?.role === "MANAGER";

  const canCreateTicket = can("CREATE_TICKET");
  const canAssignTicket = can("ASSIGN_TICKET");
  const canDeleteTicket = can("DELETE_TICKET");
  const canEditTicket = can("EDIT_TICKET");
  const canUpdateStatus = can("UPDATE_STATUS");

  const canViewAll = can("VIEW_ALL_TICKETS");

  const assignedTo =
    !canViewAll && can("VIEW_ASSIGNED_TICKETS")
      ? user?.id ?? ""
      : "";

  const currentPage = params.page ?? 1;

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );

  // Sync search and filters with query parameters
  useEffect(() => {
    if (
      params.search !== debouncedSearch ||
      params.status !== status ||
      params.priority !== priority ||
      params.assignedTo !== assignedTo
    ) {
      updateParams({
        search: debouncedSearch,
        status,
        priority,
        assignedTo,
      });
    }
  }, [
    debouncedSearch,
    status,
    priority,
    assignedTo,
    params.search,
    params.status,
    params.priority,
    params.assignedTo,
    updateParams,
  ]);

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Search
  const handleSearch = (value: string) => {
    setSearch(value);
  };

  // Filters
  const handleStatus = (value: string) => {
    setStatus(value);
  };

  const handlePriority = (value: string) => {
    setPriority(value);
  };

  // Sorting
  const handleSort = (value: string) => {
    updateParams({
      sort: value,
      page: 1,
    });
  };

  // Pagination
  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  // Retry API request
  const handleRetry = () => {
    refetch();
  };

  // Select or deselect one ticket
  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketIds((previous) =>
      previous.includes(ticketId)
        ? previous.filter((id) => id !== ticketId)
        : [...previous, ticketId]
    );

    setBulkMessage("");
    setBulkError("");
  };

  // Select or deselect all tickets on current page
  const handleSelectAll = () => {
    const currentPageIds = tickets.map(
      (ticket) => ticket.id
    );

    const allSelected =
      currentPageIds.length > 0 &&
      currentPageIds.every((id) =>
        selectedTicketIds.includes(id)
      );

    if (allSelected) {
      setSelectedTicketIds((previous) =>
        previous.filter(
          (id) => !currentPageIds.includes(id)
        )
      );
    } else {
      setSelectedTicketIds((previous) =>
        Array.from(
          new Set([...previous, ...currentPageIds])
        )
      );
    }

    setBulkMessage("");
    setBulkError("");
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedTicketIds([]);
    setBulkMessage("");
    setBulkError("");
  };

  const allCurrentPageSelected =
    tickets.length > 0 &&
    tickets.every((ticket) =>
      selectedTicketIds.includes(ticket.id)
    );

  // Bulk update selected ticket statuses
  const handleBulkStatusUpdate = async () => {
    if (
      !canUpdateStatus ||
      selectedTicketIds.length === 0 ||
      isBulkUpdating
    ) {
      return;
    }

    try {
      setBulkMessage("");
      setBulkError("");

      const result = await bulkUpdateStatus(
        selectedTicketIds,
        bulkStatus
      );

      setSelectedTicketIds(result.failedIds);

      if (result.failedIds.length > 0) {
        setBulkMessage(
          `${result.updatedIds.length} ticket(s) updated. ${result.failedIds.length} failed. Failed tickets remain selected.`
        );
      } else {
        setBulkMessage(
          `${result.updatedIds.length} ticket(s) updated successfully.`
        );
      }
    } catch (error) {
      console.error("Bulk status update failed:", error);

      setBulkError(
        "Unable to update selected tickets. Please try again."
      );
    }
  };

  // Create ticket
  const handleCreate = () => {
    if (!canCreateTicket) return;

    setSelectedTicket(null);
    openForm();
  };

  // Edit ticket
  const handleEdit = (ticket: Ticket) => {
    if (!canEditTicket) return;

    setSelectedTicket(ticket);
    openForm();
  };

  // Submit ticket form
  const handleSubmit = async (data: TicketFormData) => {
    try {
      if (selectedTicket) {
        if (!canEditTicket) return;

        await update(selectedTicket.id, data);
      } else {
        if (!canCreateTicket) return;

        await create(data);
      }

      closeForm();
      setSelectedTicket(null);
    } catch (error) {
      console.error("Unable to save ticket:", error);
      throw error;
    }
  };

  // Delete ticket
  const handleDelete = async (id: string) => {
    if (!canDeleteTicket) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ticket ${id}?`
    );

    if (!confirmed) return;

    try {
      setDeleteError("");
      await remove(id);

      setSelectedTicketIds((previous) =>
        previous.filter((ticketId) => ticketId !== id)
      );
    } catch (error) {
      console.error("Unable to delete ticket:", error);

      setDeleteError(
        "Unable to delete ticket. Please try again."
      );
    }
  };

  // Update individual ticket status
  const handleStatusChange = async (
    ticket: Ticket,
    newStatus: Ticket["status"]
  ) => {
    if (!canUpdateStatus) return;

    try {
      await update(ticket.id, { status: newStatus });
    } catch (error) {
      console.error(
        "Unable to update ticket status:",
        error
      );
    }
  };

  // Assign ticket
  const handleAssign = async (
    ticket: Ticket,
    agentId: string | null
  ) => {
    if (!canAssignTicket) return;

    try {
      await update(ticket.id, {
        assignedTo: agentId ?? "",
      });
    } catch (error) {
      console.error("Unable to assign ticket:", error);
      throw error;
    }
  };

  // Statistics for current page
  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  return (
    <div className={`app ${isManager ? "manager-dashboard" : ""}`}>
      <Header />

      <main className="dashboard">
        <div className="page-heading">
          <div>
            <h1>Customer Support Dashboard</h1>

            <p>
              Manage and track customer support tickets.
            </p>

            <p>
              Welcome, <strong>{user?.name}</strong> (
              {user?.role})
            </p>
          </div>

          <div className="dashboard-actions">
            {canCreateTicket && (
              <Button
                variant="primary"
                onClick={handleCreate}
              >
                + Create Ticket
              </Button>
            )}

            {user?.role === "ADMIN" && (
              <Button
                variant="secondary"
                onClick={() => navigate("/monitoring")}
              >
                Monitoring
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Dashboard statistics */}
        <section className="stats-grid">
          <Card title="Total Tickets">
            <h2>{total}</h2>
          </Card>

          <Card title="Open on This Page">
            <h2>{openTickets}</h2>
          </Card>

          <Card title="In Progress on This Page">
            <h2>{inProgressTickets}</h2>
          </Card>

          <Card title="Resolved on This Page">
            <h2>{resolvedTickets}</h2>
          </Card>
        </section>

        {/* Ticket management */}
        <section className="ticket-section">
          <div className="section-heading">
            <div>
              <h2>
                {canViewAll
                  ? "All Tickets"
                  : "My Assigned Tickets"}
              </h2>

              <p>
                View and manage customer support requests.
              </p>
            </div>

            <span className="ticket-count">
              {total} tickets
            </span>
          </div>

          {/* Search and filters */}
          <div className="toolbar">
            <SearchBar
              value={search}
              onChange={handleSearch}
            />

            <FilterPanel
              status={status}
              priority={priority}
              sort={params.sort ?? "newest"}
              onStatusChange={handleStatus}
              onPriorityChange={handlePriority}
              onSortChange={handleSort}
            />
          </div>

          {deleteError && (
            <Alert
              message={deleteError}
              type="error"
            />
          )}

          {/* Bulk selection and status controls */}
          {!loading && !error && tickets.length > 0 && (
            <div className="bulk-selection-controls">
              <label>
                <input
                  type="checkbox"
                  checked={allCurrentPageSelected}
                  onChange={handleSelectAll}
                  disabled={isBulkUpdating}
                />
                Select all on this page
              </label>

              <span>
                {selectedTicketIds.length} ticket(s) selected
              </span>

              {selectedTicketIds.length > 0 && (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleClearSelection}
                    disabled={isBulkUpdating}
                  >
                    Clear Selection
                  </Button>

                  {canUpdateStatus && (
                    <>
                      <select
                        value={bulkStatus}
                        onChange={(event) =>
                          setBulkStatus(
                            event.target.value as Ticket["status"]
                          )
                        }
                        disabled={isBulkUpdating}
                        aria-label="Bulk status"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">
                          In Progress
                        </option>
                        <option value="Resolved">
                          Resolved
                        </option>
                      </select>

                      <Button
                        variant="primary"
                        onClick={handleBulkStatusUpdate}
                        disabled={isBulkUpdating}
                      >
                        {isBulkUpdating
                          ? "Updating..."
                          : "Update Selected"}
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {bulkMessage && (
            <Alert
              message={bulkMessage}
              type="success"
            />
          )}

          {bulkError && (
            <Alert
              message={bulkError}
              type="error"
            />
          )}

          {/* Loading, error and ticket table */}
          {loading ? (
            <Loader message="Loading tickets..." />
          ) : error ? (
            <div>
              <Alert
                message={error}
                type="error"
              />

              <Button
                variant="secondary"
                onClick={handleRetry}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <TicketTable
                tickets={tickets}
                selectedTicketIds={selectedTicketIds}
                onSelectTicket={handleSelectTicket}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canEditTicket}
                canDelete={canDeleteTicket}
                canUpdateStatus={canUpdateStatus}
                onStatusChange={handleStatusChange}
                onAssign={handleAssign}
                canAssign={canAssignTicket}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </main>

      {/* Create and edit form */}
      {showForm && (
        <TicketForm
          key={selectedTicket?.id ?? "new-ticket"}
          ticket={selectedTicket}
          onSubmit={handleSubmit}
          onClose={() => {
            closeForm();
            setSelectedTicket(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
