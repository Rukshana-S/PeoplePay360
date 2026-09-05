import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/button";

const ConfirmDeleteDialog = ({ isOpen, onClose, onConfirm, title = "Confirm Deletion", message = "Are you sure you want to delete this record? This action cannot be undone." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{message}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E293B]">
          <Button variant="outline" onClick={onClose} className="border-[#1E293B] text-slate-300 hover:bg-slate-800">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md shadow-rose-600/20">
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDialog;
