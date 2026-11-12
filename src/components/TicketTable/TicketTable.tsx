
import { useState } from "react";
import type { Ticket } from "../../types/ticket.types";
import { getAgents } from "../../services/authService";

interface TicketTableProps {
  tickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  canUpdateStatus: boolean;
  onStatusChange: (ticket: Ticket, status: Ticket["status"]) => void;
  onAssign: (ticket: Ticket, agentId: string | null) => void | Promise<void>;
  canAssign: boolean;
}

const TicketTable = ({
  tickets,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  canUpdateStatus,
  onStatusChange,
  onAssign,
  canAssign,
}: TicketTableProps) => {
  const agents = getAgents();

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assigning, setAssigning] = useState(false);

  const handleConfirmAssign = async () => {
    if (!selectedTicket) return;

    try {
      setAssigning(true);

      await onAssign(
        selectedTicket,
        selectedAgent === "" ? null : selectedAgent
      );

      setSelectedTicket(null);
    } catch (error) {
      console.error("Assignment failed:", error);
    } finally {
      setAssigning(false);
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tickets found</h3>
        <p>Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              {canAssign && <th>Assigned To</th>}
              <th>Created At</th>
              {(canEdit || canDelete || canAssign) && (
                <th>Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.customerName}</td>
                <td>{ticket.subject}</td>

                <td>
                  <span className={`priority ${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </span>
                </td>

                <td>
                  {canUpdateStatus ? (
                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        onStatusChange(
                          ticket,
                          e.target.value as Ticket["status"]
                        )
                      }
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
                    <span
                      className={`status ${ticket.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {ticket.status}
                    </span>
                  )}
                </td>

                {canAssign && (
                  <td>
                    {agents.find(
                      (agent) => agent.id === ticket.assignedTo
                    )?.name ?? "Unassigned"}
                  </td>
                )}

                <td>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>

                {(canEdit || canDelete || canAssign) && (
                  <td>
                    <div className="table-actions">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(ticket)}
                        >
                          Edit
                        </button>
                      )}

                      {canAssign && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setSelectedAgent(ticket.assignedTo ?? "");
                          }}
                        >
                          Assign
                        </button>
                      )}

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(ticket.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Ticket Popup */}
      {selectedTicket && canAssign && (
        <div
          role="presentation"
          onClick={() => !assigning && setSelectedTicket(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
          
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-title"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "28px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "420px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.2)",
            }}
          >
            <h2 id="assign-title">Assign Ticket</h2>

            <p>
              Ticket ID: <strong>{selectedTicket.id}</strong>
            </p>

            <p>
              Customer: <strong>{selectedTicket.customerName}</strong>
            </p>

            <label
              htmlFor="assign-agent"
              style={{ display: "block", marginBottom: "8px" }}
            >
              Select Agent
            </label>

            <select
              id="assign-agent"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Unassigned</option>

              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                disabled={assigning}
                onClick={() => setSelectedTicket(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={assigning}
                onClick={handleConfirmAssign}
              >
                {assigning ? "Saving..." : "Confirm Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketTable;
