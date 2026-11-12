
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import TicketTable from "../../components/TicketTable/TicketTable";
import TicketForm from "../../components/TicketForm/TicketForm";
import Pagination from "../../components/Pagination/Pagination";

import { useReduxTickets } from "../../hooks/useReduxTickets";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";

import type {
  Ticket,
  TicketFormData,
} from "../../types/ticket.types";

import "../../App.css";

function Dashboard() {
  const { user, logout } = useAuth();
  const { can } = usePermissions();
  const navigate = useNavigate();

  const {
    tickets,
    loading,
    error,
    create,
    update,
    remove,
  } = useReduxTickets();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  const [deleteError, setDeleteError] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const PAGE_SIZE = 5;

  const isManager = user?.role === "MANAGER";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Tickets based on user role
  const visibleTickets = useMemo(() => {
    if (!user) return [];

    if (can("VIEW_ALL_TICKETS")) {
      return tickets;
    }

    if (can("VIEW_ASSIGNED_TICKETS")) {
      return tickets.filter(
        (ticket) => ticket.assignedTo === user.id
      );
    }

    return [];
  }, [tickets, user, can]);

  // Search, filter and sort
  const filteredTickets = useMemo(() => {
    let result = [...visibleTickets];

    const searchValue = debouncedSearch.toLowerCase().trim();

    if (searchValue) {
      result = result.filter((ticket) =>
        [
          ticket.id,
          ticket.customerName,
          ticket.subject,
        ].some((value) =>
          value.toLowerCase().includes(searchValue)
        )
      );
    }

    if (status) {
      result = result.filter(
        (ticket) => ticket.status === status
      );
    }

    if (priority) {
      result = result.filter(
        (ticket) => ticket.priority === priority
      );
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    if (sort === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );
    }

    if (sort === "priority") {
      const priorityOrder = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      result.sort(
        (a, b) =>
          priorityOrder[b.priority] -
          priorityOrder[a.priority]
      );
    }

    return result;
  }, [visibleTickets, debouncedSearch, status, priority, sort]);

  // Pagination
  const totalPages = Math.ceil(
    filteredTickets.length / PAGE_SIZE
  );

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Search and filter handlers
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatus = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handlePriority = (value: string) => {
    setPriority(value);
    setCurrentPage(1);
  };

  const handleSort = (value: string) => {
    setSort(value);
    setCurrentPage(1);
  };

  // Create ticket
  const handleCreate = () => {
    if (isManager || !can("CREATE_TICKET")) return;

    setSelectedTicket(null);
    setShowForm(true);
  };

  // Edit ticket
  const handleEdit = (ticket: Ticket) => {
    if (!can("EDIT_TICKET")) return;

    setSelectedTicket(ticket);
    setShowForm(true);
  };

  // Create or update ticket
  const handleSubmit = async (data: TicketFormData) => {
    try {
      if (selectedTicket) {
        if (!can("EDIT_TICKET")) return;

        await update(selectedTicket.id, data);
      } else {
        if (isManager || !can("CREATE_TICKET")) return;

        await create(data);
      }

      setShowForm(false);
      setSelectedTicket(null);
      setCurrentPage(1);
    } catch (error) {
      console.error("Unable to save ticket:", error);
      throw error;
    }
  };

  // Delete ticket
  const handleDelete = async (id: string) => {
    if (isManager || !can("DELETE_TICKET")) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ticket ${id}?`
    );

    if (!confirmed) return;

    try {
      setDeleteError("");
      await remove(id);

      if (
        currentPage > 1 &&
        paginatedTickets.length === 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Unable to delete ticket:", error);

      setDeleteError(
        "Unable to delete ticket. Please try again."
      );
    }
  };

  // Update ticket status
  const handleStatusChange = async (
    ticket: Ticket,
    newStatus: Ticket["status"]
  ) => {
    if (!can("UPDATE_STATUS")) return;

    try {
      await update(ticket.id, { status: newStatus });
    } catch (error) {
      console.error("Unable to update ticket status:", error);
    }
  };

  // Assign ticket to agent
  
const handleAssign = async (
  ticket: Ticket,
  agentId: string | null
) => {
  if (!isManager || !can("ASSIGN_TICKET")) return;

  try {
    await update(ticket.id, {
      assignedTo: agentId ?? "",
    });
  } catch (error) {
    console.error("Unable to assign ticket:", error);
    throw error;
  }
};


  // Dashboard statistics
  const openTickets = visibleTickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = visibleTickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = visibleTickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  return (
    <div className={`app ${isManager ? "manager-dashboard" : ""}`}>
      <Header />

      <main className="dashboard">
        {/* Page heading */}
        <div className="page-heading">
          <div>
            <h1>Customer Support Dashboard</h1>
            <p>Manage and track customer support tickets.</p>

            <p>
              Welcome, <strong>{user?.name}</strong> (
              {user?.role})
            </p>
          </div>

          <div className="dashboard-actions">
            {!isManager && can("CREATE_TICKET") && (
              <button
                className="primary-btn"
                onClick={handleCreate}
              >
                + Create Ticket
              </button>
            )}

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Tickets</span>
            <h2>{visibleTickets.length}</h2>
          </div>

          <div className="stat-card">
            <span>Open Tickets</span>
            <h2>{openTickets}</h2>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <h2>{inProgressTickets}</h2>
          </div>

          <div className="stat-card">
            <span>Resolved</span>
            <h2>{resolvedTickets}</h2>
          </div>
        </section>

        {/* Ticket management */}
        <section className="ticket-section">
          <div className="section-heading">
            <div>
              <h2>
                {can("VIEW_ALL_TICKETS")
                  ? "All Tickets"
                  : "My Assigned Tickets"}
              </h2>

              <p>
                View and manage customer support requests.
              </p>
            </div>

            <span className="ticket-count">
              {filteredTickets.length} tickets
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
              onStatusChange={handleStatus}
              onPriorityChange={handlePriority}
              onSortChange={handleSort}
            />
          </div>

          {deleteError && (
            <p className="error-message" role="alert">
              {deleteError}
            </p>
          )}

          {loading ? (
            <div className="loader" role="status">
              Loading tickets...
            </div>
          ) : error ? (
            <div className="error-message" role="alert">
              {error}
              <button onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : (
            <>
              <TicketTable
                tickets={paginatedTickets}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={can("EDIT_TICKET")}
                canDelete={!isManager && can("DELETE_TICKET")}
                canUpdateStatus={can("UPDATE_STATUS")}
                onStatusChange={handleStatusChange}
                onAssign={handleAssign}
                canAssign={
                  isManager && can("ASSIGN_TICKET")
                }
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </section>
      </main>

     {showForm && (
  <TicketForm
    key={selectedTicket?.id ?? "new-ticket"}
    ticket={selectedTicket}
    onSubmit={handleSubmit}
    onClose={() => {
      setShowForm(false);
      setSelectedTicket(null);
    }}
  />
)}
    </div>
  );
}

export default Dashboard;
