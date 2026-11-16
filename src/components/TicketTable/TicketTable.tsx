
import { useState } from "react";
import type { Ticket } from "../../types/ticket.types";
import { getAgents } from "../../services/authService";
import Badge from "../common/Badge";
import DataTable, {
  type DataTableColumn,
} from "../common/DataTable";
import Modal from "../common/Modal/Modal";
import Button from "../common/Button";
import "./TicketTable.css";

interface TicketTableProps {
  tickets: Ticket[];
  selectedTicketIds: string[];
  onSelectTicket: (ticketId: string) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  canUpdateStatus: boolean;
  onStatusChange: (
    ticket: Ticket,
    status: Ticket["status"]
  ) => void;
  onAssign: (
    ticket: Ticket,
    agentId: string | null
  ) => void | Promise<void>;
  canAssign: boolean;
}

const TicketTable = ({
  tickets,
  selectedTicketIds,
  onSelectTicket,
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

  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  const [selectedAgent, setSelectedAgent] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");

  const closeAssignModal = () => {
    if (assigning) return;

    setSelectedTicket(null);
    setSelectedAgent("");
    setAssignmentError("");
  };

  const handleConfirmAssign = async () => {
    if (!selectedTicket) return;

    try {
      setAssigning(true);
      setAssignmentError("");

      await onAssign(
        selectedTicket,
        selectedAgent === "" ? null : selectedAgent
      );

      setSelectedTicket(null);
      setSelectedAgent("");
    } catch (error) {
      console.error("Assignment failed:", error);

      setAssignmentError(
        error instanceof Error
          ? error.message
          : "Failed to assign ticket. Please try again."
      );
    } finally {
      setAssigning(false);
    }
  };

  const hasActions = canEdit || canDelete || canAssign;

  const columns: DataTableColumn<Ticket>[] = [
    {
      id: "selection",
      header: "Select",
      render: (ticket) => (
        <input
          type="checkbox"
          aria-label={`Select ticket ${ticket.id}`}
          checked={selectedTicketIds.includes(ticket.id)}
          onChange={() => onSelectTicket(ticket.id)}
        />
      ),
    },
    {
      id: "id",
      header: "Ticket ID",
      render: (ticket) => ticket.id,
    },
    {
      id: "customer",
      header: "Customer",
      render: (ticket) => ticket.customerName,
    },
    {
      id: "subject",
      header: "Subject",
      render: (ticket) => ticket.subject,
    },
    {
      id: "priority",
      header: "Priority",
      render: (ticket) => (
        <span className={`priority ${ticket.priority.toLowerCase()}`}>
          {ticket.priority}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      render: (ticket) =>
        canUpdateStatus ? (
          <select
            value={ticket.status}
            onChange={(event) =>
              onStatusChange(
                ticket,
                event.target.value as Ticket["status"]
              )
            }
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        ) : (
          <Badge
            label={ticket.status}
            variant={
              ticket.status === "Open"
                ? "success"
                : ticket.status === "In Progress"
                  ? "warning"
                  : "info"
            }
          />
        ),
    },
    ...(canAssign
      ? [
          {
            id: "assignedTo",
            header: "Assigned To",
            render: (ticket: Ticket) =>
              agents.find(
                (agent) => agent.id === ticket.assignedTo
              )?.name ?? "Unassigned",
          },
        ]
      : []),
    {
      id: "createdAt",
      header: "Created At",
      render: (ticket) =>
        new Date(ticket.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <>
      <DataTable<Ticket>
        data={tickets}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        emptyMessage="No tickets found. Try changing your search or filters."
        pagination={false}
        renderActions={
          hasActions
            ? (ticket) => (
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
                        setAssignmentError("");
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
              )
            : undefined
        }
      />

      <Modal
        isOpen={Boolean(selectedTicket && canAssign)}
        onClose={closeAssignModal}
        size="small"
      >
        <Modal.Header>
          <h2>Assign Ticket</h2>
        </Modal.Header>

        <Modal.Body>
          {selectedTicket && (
            <>
              <p>
                Ticket ID: <strong>{selectedTicket.id}</strong>
              </p>

              <p>
                Customer:{" "}
                <strong>{selectedTicket.customerName}</strong>
              </p>

              <label htmlFor="assign-agent">
                Select Agent
              </label>

              <select
                id="assign-agent"
                value={selectedAgent}
                onChange={(event) =>
                  setSelectedAgent(event.target.value)
                }
                disabled={assigning}
                className="modal-agent-select"
              >
                <option value="">Unassigned</option>

                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>

              {assignmentError && (
                <p className="modal-assignment-error" role="alert">
                  {assignmentError}
                </p>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeAssignModal}
            disabled={assigning}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleConfirmAssign}
            loading={assigning}
          >
            Confirm Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TicketTable;
