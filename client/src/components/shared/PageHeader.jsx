import React from "react";
import { Search, Plus, LayoutGrid, List, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const PageHeader = ({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  actionLabel,
  onActionClick,
  viewMode,
  onViewModeChange,
  showBack = false,
  backPath = -1,
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 mb-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => (typeof backPath === "string" ? navigate(backPath) : navigate(-1))}
              className="border-[#1E293B] bg-[#0F172A] hover:bg-[#1E293B] text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {children}

          {viewMode && onViewModeChange && (
            <div className="flex items-center p-0.5 rounded-lg bg-[#0F172A] border border-[#1E293B]">
              <button
                type="button"
                onClick={() => onViewModeChange("kanban")}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === "kanban" ? "bg-[#5B8DEF] text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
                title="Kanban View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("list")}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === "list" ? "bg-[#5B8DEF] text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}

          {actionLabel && onActionClick && (
            <Button
              onClick={onActionClick}
              className="bg-[#5B8DEF] hover:bg-[#4a7ad8] text-white font-medium text-xs px-3.5 h-9 rounded-lg shadow-md shadow-[#5B8DEF]/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{actionLabel}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Optional Search Input */}
      {onSearchChange !== undefined && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B8DEF] transition-colors"
          />
        </div>
      )}
    </div>
  );
};

export default PageHeader;
