import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const paginationRef = useRef<HTMLDivElement>(null);

  // Fallback guards to prevent NaN rendering bugs
  const safeTotalPages = Number(totalPages) && !isNaN(totalPages) ? Number(totalPages) : 1;
  const safeCurrentPage = Number(currentPage) && !isNaN(currentPage) ? Number(currentPage) : 1;

  useEffect(() => {
    if (paginationRef.current) {
      gsap.fromTo(
        paginationRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [safeTotalPages]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (safeTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (safeCurrentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", safeTotalPages);
      } else if (safeCurrentPage >= safeTotalPages - 2) {
        pages.push(1, "...", safeTotalPages - 3, safeTotalPages - 2, safeTotalPages - 1, safeTotalPages);
      } else {
        pages.push(1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", safeTotalPages);
      }
    }
    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== safeCurrentPage) {
      onPageChange(page);
    }
  };

  if (safeTotalPages <= 1) return null;

  return (
    <div
      ref={paginationRef}
      className="flex items-center justify-center gap-1.5 sm:gap-2 my-8 px-4 flex-wrap"
    >
      <button
        onClick={() => handlePageClick(safeCurrentPage - 1)}
        disabled={safeCurrentPage === 1}
        aria-label="Previous Page"
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((page, index) => {
        const isCurrent = page === safeCurrentPage;
        const isEllipsis = page === "...";

        return (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            disabled={isEllipsis}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-medium text-sm transition-all shadow-xs flex items-center justify-center ${
              isEllipsis
                ? "border-transparent text-neutral-400 cursor-default bg-transparent shadow-none"
                : isCurrent
                ? "bg-emerald-800 text-white font-bold border border-emerald-800 scale-105"
                : "border border-neutral-200 bg-white text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => handlePageClick(safeCurrentPage + 1)}
        disabled={safeCurrentPage === safeTotalPages}
        aria-label="Next Page"
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;