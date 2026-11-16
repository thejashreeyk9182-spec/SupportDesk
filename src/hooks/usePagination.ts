
import { useEffect, useMemo, useState } from "react";

function usePagination<T>(items: T[], pageSize: number = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  const safePageSize = pageSize > 0 ? pageSize : 5;

  const totalPages = Math.max(
    1,
    Math.ceil(items.length / safePageSize)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedItems = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * safePageSize;

    return items.slice(startIndex, startIndex + safePageSize);
  }, [items, currentPage, totalPages, safePageSize]);

  const goToPage = (page: number) => {
    setCurrentPage(
      Math.min(Math.max(1, page), totalPages)
    );
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const previousPage = () => {
    goToPage(currentPage - 1);
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    previousPage,
    resetPage,
  };
}

export default usePagination;
