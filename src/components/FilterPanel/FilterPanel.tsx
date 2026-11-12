
interface FilterPanelProps {
  status: string;
  priority: string;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const FilterPanel = ({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}: FilterPanelProps) => {
  return (
    <div className="filter-panel">

      {/* Status Filter */}
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>

      {/* Priority Filter */}
      <select
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value)}
        aria-label="Filter by priority"
      >
        <option value="">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {/* Sorting */}
      <select
        defaultValue="newest"
        onChange={(event) => onSortChange(event.target.value)}
        aria-label="Sort tickets"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="priority">Priority</option>
      </select>

    </div>
  );
};

export default FilterPanel;
