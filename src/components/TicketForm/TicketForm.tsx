
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Ticket, TicketFormData } from "../../types/ticket.types";
import "./TicketForm.css";

interface TicketFormProps {
  ticket: Ticket | null;
  onSubmit: (data: TicketFormData) => Promise<void>;
  onClose: () => void;
}

const initialForm: TicketFormData = {
  customerName: "",
  email: "",
  subject: "",
  description: "",
  priority: "Medium",
  status: "Open",
};

const TicketForm = ({
  ticket,
  onSubmit,
  onClose,
}: TicketFormProps) => {
  const [formData, setFormData] = useState<TicketFormData>(() =>
    ticket
      ? {
          customerName: ticket.customerName,
          email: ticket.email,
          subject: ticket.subject,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
        }
      : initialForm
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.customerName.trim())) {
      newErrors.customerName = "Enter a valid customer name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email (example@gmail.com)";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      await onSubmit({
        ...formData,
        customerName: formData.customerName.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        description: formData.description.trim(),
      });
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: "Unable to save ticket. Please try again.",
      }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <div className="ticket-form-header">
        <div>
          <h2>{ticket ? "Edit Ticket" : "Create New Ticket"}</h2>
          <p>Enter the customer support ticket details.</p>
        </div>

        <button
          type="button"
          className="ticket-form-close"
          onClick={onClose}
          aria-label="Close form"
        >
          ×
        </button>
      </div>

      <div className="ticket-form-body">
        <div className="ticket-form-group">
          <label htmlFor="customerName">Customer Name *</label>
          <input
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter customer name"
            autoComplete="name"
          />
          {errors.customerName && (
            <span className="ticket-form-error">{errors.customerName}</span>
          )}
        </div>

        <div className="ticket-form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            autoComplete="email"
          />
          {errors.email && (
            <span className="ticket-form-error">{errors.email}</span>
          )}
        </div>

        <div className="ticket-form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter ticket subject"
          />
          {errors.subject && (
            <span className="ticket-form-error">{errors.subject}</span>
          )}
        </div>

        <div className="ticket-form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue..."
            rows={4}
          />
          {errors.description && (
            <span className="ticket-form-error">{errors.description}</span>
          )}
        </div>

        <div className="ticket-form-row">
          <div className="ticket-form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="ticket-form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {errors.submit && (
          <p className="ticket-form-error">{errors.submit}</p>
        )}
      </div>

      <div className="ticket-form-actions">
        <button
          type="button"
          className="ticket-form-cancel"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="ticket-form-submit"
          disabled={saving}
        >
          {saving ? "Saving..." : ticket ? "Update Ticket" : "Create Ticket"}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
