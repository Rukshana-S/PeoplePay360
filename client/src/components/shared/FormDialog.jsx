import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

/**
 * Generic reusable dialog for create / edit forms.
 * Props:
 * - open: boolean to control visibility
 * - onOpenChange: (open: boolean) => void
 * - title: dialog title
 * - description?: optional description text
 * - children: form fields JSX
 * - onSubmit: function called when the primary action is triggered
 * - isSubmitting?: boolean to show loading state
 * - saveLabel?: label for the primary button (default "Save")
 * - cancelLabel?: label for cancel button (default "Cancel")
 */
const FormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  isSubmitting = false,
  saveLabel = "Save",
  cancelLabel = "Cancel",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit && onSubmit();
          }}
          className="space-y-4"
        >
          {children}
          <DialogFooter className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin">⏳</span> Saving…
                </span>
              ) : (
                saveLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
