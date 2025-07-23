import React from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem 0;
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${(props) =>
    props.active ? props.theme.colors.surface : props.theme.colors.text};
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all ${(props) => props.theme.transitions.normal};
  font-size: 0.875rem;
  font-weight: 500;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.active ? props.theme.colors.primary : props.theme.colors.primary};
    color: ${(props) => props.theme.colors.surface};
    border-color: ${(props) => props.theme.colors.primary};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    background-color: ${(props) => props.theme.colors.surface};
    color: ${(props) => props.theme.colors.textSecondary};
  }
`;

const PaginationInfo = styled.span`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0 1rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

const PaginationEllipsis = styled.span`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  padding: 0 0.25rem;
`;

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  maxVisiblePages = 7,
}) => {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // More complex logic for showing pages with ellipsis
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      // Always show first page
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("ellipsis-start");
        }
      }

      // Show pages in range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Always show last page
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("ellipsis-end");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <PaginationContainer>
      {/* Previous Button */}
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous page"
      >
        <FaChevronLeft />
      </PaginationButton>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (typeof page === "string") {
          return (
            <PaginationEllipsis key={`ellipsis-${index}`}>
              ...
            </PaginationEllipsis>
          );
        }

        return (
          <PaginationButton
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
            title={`Go to page ${page}`}
          >
            {page}
          </PaginationButton>
        );
      })}

      {/* Next Button */}
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next page"
      >
        <FaChevronRight />
      </PaginationButton>

      {/* Pagination Info */}
      {showInfo && (
        <PaginationInfo>
          Showing {startItem}-{endItem} of {totalItems}
        </PaginationInfo>
      )}
    </PaginationContainer>
  );
};

export default Pagination;
