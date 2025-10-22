import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  className?: string;
}

function CustomTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  className = "",
}: CustomTableProps<T>) {
  const getNestedValue = (obj: T, path: string): unknown => {
    return path
      .split(".")
      .reduce(
        (value: unknown, key) => (value as Record<string, unknown>)?.[key],
        obj
      );
  };

  const renderCell = (column: Column<T>, record: T, index: number) => {
    const value = getNestedValue(record, column.key as string);

    if (column.render) {
      return column.render(value, record, index);
    }

    return value?.toString() || "";
  };

  const renderPagination = () => {
    if (!pagination || !onPageChange || pagination.totalRecords === 0)
      return null;

    const { currentPage, totalPages, totalRecords, pageSize } = pagination;
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);

    // Generate page numbers to show
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const showPages = 5; // Show 5 page numbers max

      if (totalPages <= showPages) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current page
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, currentPage + 2);

        // Adjust if at the beginning or end
        if (currentPage <= 3) {
          end = 5;
        }
        if (currentPage >= totalPages - 2) {
          start = totalPages - 4;
        }

        // Add first page and ellipsis if needed
        if (start > 1) {
          pages.push(1);
          if (start > 2) pages.push("...");
        }

        // Add page numbers
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        // Add ellipsis and last page if needed
        if (end < totalPages) {
          if (end < totalPages - 1) pages.push("...");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {startRecord} to {endRecord} of {totalRecords} results
        </div>

        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex space-x-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={page === "..." || page === currentPage}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : page === "..."
                    ? "text-gray-400 cursor-default"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
      >
        <div className="p-8 text-center">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.width ? `w-${column.width}` : ""
                  } ${
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="text-center">
                      <p className="text-gray-600 font-medium">
                        No patents found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting your search criteria or filters.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record, recordIndex) => (
                <tr
                  key={recordIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column, columnIndex) => (
                    <td
                      key={columnIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {renderCell(column, record, recordIndex)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}

export default CustomTable;
