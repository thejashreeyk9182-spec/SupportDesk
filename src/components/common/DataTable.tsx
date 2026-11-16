
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import "./DataTable.css";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string | number;
  loading?: boolean;
  pageSize?: number;
  selectable?: boolean;
  emptyMessage?: string;
  onSelectionChange?: (
    selectedIds: Array<string | number>
  ) => void;
  renderActions?: (row: T) => ReactNode;
  pagination?: boolean;
}

function DataTable<T>({
  data,
  columns,
  getRowId,
  loading = false,
  pageSize = 5,
  selectable = false,
  emptyMessage = "No records found",
  onSelectionChange,
  renderActions,
  pagination = true,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");

  const [selectedIds, setSelectedIds] =
    useState<Array<string | number>>([]);

  const safePageSize = Math.max(1, pageSize);

  // Reset page when data changes
  useEffect(() => {
    setPage(1);
  }, [data]);

  // Sort table data
  const sortedData = useMemo(() => {
    const column = columns.find(
      (item) => item.id === sortColumn
    );

    if (!column?.sortValue) {
      return data;
    }

    return [...data].sort((a, b) => {
      const first = column.sortValue!(a);
      const second = column.sortValue!(b);

      let result: number;

      if (
        typeof first === "number" &&
        typeof second === "number"
      ) {
        result = first - second;
      } else {
        result = String(first).localeCompare(
          String(second)
        );
      }

      return sortDirection === "asc"
        ? result
        : -result;
    });
  }, [data, columns, sortColumn, sortDirection]);

  // Pagination calculation
  const totalPages = Math.max(
    1,
    Math.ceil(sortedData.length / safePageSize)
  );

  const currentPage = Math.min(page, totalPages);

  // Display all rows or current page
  const visibleData = pagination
    ? sortedData.slice(
        (currentPage - 1) * safePageSize,
        currentPage * safePageSize
      )
    : sortedData;

  // Handle column sorting
  const handleSort = (
    column: DataTableColumn<T>
  ) => {
    if (!column.sortable || !column.sortValue) {
      return;
    }

    if (sortColumn === column.id) {
      setSortDirection((previous) =>
        previous === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(column.id);
      setSortDirection("asc");
    }

    setPage(1);
  };

  // Handle individual row selection
  const handleSelect = (
    id: string | number
  ) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];

    setSelectedIds(updated);
    onSelectionChange?.(updated);
  };

  // Handle select all visible rows
  const handleSelectAll = () => {
    const visibleIds = visibleData.map(getRowId);

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) =>
        selectedIds.includes(id)
      );

    const updated = allSelected
      ? selectedIds.filter(
          (id) => !visibleIds.includes(id)
        )
      : Array.from(
          new Set([...selectedIds, ...visibleIds])
        );

    setSelectedIds(updated);
    onSelectionChange?.(updated);
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="data-table-message"
        role="status"
        aria-live="polite"
      >
        Loading...
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div
        className="data-table-message"
        role="status"
        aria-live="polite"
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="data-table-wrapper">
      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {selectable && (
                <th>
                  <input
                    type="checkbox"
                    aria-label="Select all rows on this page"
                    checked={
                      visibleData.length > 0 &&
                      visibleData.every((row) =>
                        selectedIds.includes(
                          getRowId(row)
                        )
                      )
                    }
                    onChange={handleSelectAll}
                  />
                </th>
              )}

              {columns.map((column) => (
                <th key={column.id}>
                  <button
                    type="button"
                    className="data-table-sort"
                    disabled={
                      !column.sortable ||
                      !column.sortValue
                    }
                    onClick={() => handleSort(column)}
                  >
                    {column.header}

                    {sortColumn === column.id
                      ? sortDirection === "asc"
                        ? " ↑"
                        : " ↓"
                      : ""}
                  </button>
                </th>
              ))}

              {renderActions && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {visibleData.map((row) => {
              const id = getRowId(row);

              return (
                <tr key={id}>
                  {selectable && (
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select row ${id}`}
                        checked={selectedIds.includes(id)}
                        onChange={() =>
                          handleSelect(id)
                        }
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td key={column.id}>
                      {column.render(row)}
                    </td>
                  ))}

                  {renderActions && (
                    <td>{renderActions(row)}</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="data-table-pagination">
          <span>
            Page {currentPage} of {totalPages}
          </span>

          <div>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setPage((previous) =>
                  Math.max(1, previous - 1)
                )
              }
            >
              Previous
            </button>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((previous) =>
                  Math.min(totalPages, previous + 1)
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
