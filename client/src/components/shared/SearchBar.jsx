import React from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search records..." }) => {
  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B8DEF] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
