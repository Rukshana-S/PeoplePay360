import React from "react";
import { Filter } from "lucide-react";

const FilterBar = ({ options = [], activeFilter, onFilterChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2 shrink-0">
        <Filter className="w-3.5 h-3.5" />
        <span>Filter:</span>
      </div>
      {options.map((opt) => {
        const isActive = activeFilter === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onFilterChange(opt.value)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
              isActive
                ? "bg-[#5B8DEF] text-white shadow-sm"
                : "bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white hover:border-slate-700"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
