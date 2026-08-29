import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paginationRef.current) {
      gsap.fromTo(
        paginationRef.current.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: "power2.out" }
      );
    }
  }, [totalPages, currentPage]);

  if (totalPages <= 1) return null;

  // Generate smart page numbers with ellipses (...)
  const getPageNumbers = () => {
    const delta = 1;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div
      ref={paginationRef}
      className="flex justify-center items-center gap-1.5 sm:gap-2 my-10 select-none flex-wrap"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-neutral-600 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
        aria-label="Previous Page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`dot-${index}`}
              className="px-1.5 text-neutral-400 text-sm font-medium flex items-center justify-center h-9 sm:h-10"
            >
              ...
            </span>
          );
        }

        const isSelected = currentPage === page;

        return (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer flex items-center justify-center ${
              isSelected
                ? "bg-[#09221F] text-white shadow-md scale-105"
                : "border border-neutral-200 bg-white text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-neutral-600 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
        aria-label="Next Page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;