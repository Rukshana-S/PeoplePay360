import React from "react";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "../ui/button";

const FormActions = ({ onSave, onCancel, isSubmitting = false, saveLabel = "Save Changes", cancelLabel = "Cancel" }) => {
  return (
    <div className="pt-4 border-t border-[#1E293B] flex items-center justify-end gap-3">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-[#1E293B] text-slate-300 hover:bg-slate-800 text-xs px-4 h-9"
        >
          <X className="w-3.5 h-3.5 mr-1.5" />
          {cancelLabel}
        </Button>
      )}

      <Button
        type={onSave ? "button" : "submit"}
        onClick={onSave}
        disabled={isSubmitting}
        className="bg-[#5B8DEF] hover:bg-[#4a7ad8] text-white font-semibold text-xs px-5 h-9 rounded-lg shadow-md shadow-[#5B8DEF]/20 flex items-center gap-1.5 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>{saveLabel}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;
