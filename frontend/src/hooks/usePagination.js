import { useState, useMemo, useEffect, useCallback } from "react";

/**
 * Custom hook for managing pagination state and logic
 * @param {Array} data - The array of data to paginate
 * @param {number} itemsPerPage - Number of items per page (default: 12)
 * @param {Object} options - Additional options
 * @returns {Object} Pagination state and helpers
 */
export const usePagination = (data = [], itemsPerPage = 12, options = {}) => {
  const { resetOnDataChange = true, initialPage = 1 } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);

  // Reset to first page when data changes (if enabled)
  useEffect(() => {
    if (resetOnDataChange) {
      setCurrentPage(1);
    }
  }, [data.length, resetOnDataChange]);

  // Calculate pagination values
  const paginationData = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    return {
      currentItems,
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage,
      startIndex,
      endIndex: Math.min(endIndex, totalItems),
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
    };
  }, [data, currentPage, itemsPerPage]);

  // Page navigation functions
  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, paginationData.totalPages));
    setCurrentPage(validPage);
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(paginationData.totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  const resetPagination = () => setCurrentPage(1);

  return {
    ...paginationData,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    resetPagination,
    setCurrentPage,
  };
};

/**
 * Custom hook for server-side pagination
 * @param {Function} fetchFunction - Function to fetch data from server
 * @param {number} itemsPerPage - Number of items per page
 * @param {Object} initialFilters - Initial filter parameters
 * @returns {Object} Server pagination state and helpers
 */
export const useServerPagination = (
  fetchFunction,
  itemsPerPage = 12,
  initialFilters = {}
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchData = useCallback(
    async (page = currentPage, newFilters = filters) => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page,
          limit: itemsPerPage,
          ...newFilters,
        };

        const response = await fetchFunction(params);

        // Handle different response formats
        if (response.data && Array.isArray(response.data)) {
          setData(response.data);
          setTotalItems(
            response.total || response.count || response.data.length
          );
        } else if (Array.isArray(response)) {
          setData(response);
          setTotalItems(response.length);
        } else {
          setData(response.items || response.results || []);
          setTotalItems(response.total || response.count || 0);
        }
      } catch (err) {
        setError(err);
        setData([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, filters, itemsPerPage, fetchFunction]
  );

  // Fetch data when page or filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const refresh = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    filters,
    goToPage,
    updateFilters,
    resetFilters,
    refresh,
    fetchData,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
};
