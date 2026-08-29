import React from "react";
import { ArrowUpDown } from "lucide-react";

interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOptions: SortOption[];
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  setSortBy,
  sortOptions,
}) => {
  return (
    <div className="flex justify-end w-full mb-6">
      <div className="relative flex items-center">
        <ArrowUpDown className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort products"
          className="pl-10 pr-9 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 text-sm font-medium focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer appearance-none transition-all"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 pointer-events-none text-neutral-400 text-xs">
          ▼
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;