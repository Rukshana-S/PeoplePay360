import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "../ui/button";

const EmptyState = ({ title = "No records found", description = "Try adjusting your search query or filter options.", actionLabel, onAction }) => {
  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8 shadow-xl">
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
        <FolderOpen className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-white text-base">{title}</h3>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-[#5B8DEF] hover:bg-[#4a7ad8] text-white text-xs px-4 h-9">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
