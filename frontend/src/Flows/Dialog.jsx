import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

// ─── Delete Dialog ─────────────────────────────────────────────────────────────

export function DeleteDialog({ open, onClose, onConfirm, isLoading, flowName }) {
  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <DialogTitle>Delete Flow</DialogTitle>
          </div>
          <DialogDescription className="pl-12">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{flowName}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Deleting…
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Run Result Dialog ─────────────────────────────────────────────────────────

export function RunDialog({ open, onClose, message }) {
  const isSuccess = message?.toLowerCase().includes("success");

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isSuccess ? "bg-green-100" : "bg-destructive/10"
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 ${isSuccess ? "text-green-600" : "text-destructive"}`}
              />
            </div>
            <DialogTitle>Execution Result</DialogTitle>
          </div>
          <DialogDescription className="pl-12">{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Create Dialog ─────────────────────────────────────────────────────────────

export function CreateDialog({
  open,
  onClose,
  onCreate,
  isLoading,
  newFlowName,
  setNewFlowName,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newFlowName.trim()) onCreate();
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal>
      <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle>Create a new Flow</DialogTitle>
          <DialogDescription>
            Give your workflow a clear, recognizable name.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          <Input
            autoFocus
            placeholder="e.g. Welcome Email Sequence"
            value={newFlowName}
            disabled={isLoading}
            onChange={(e) => setNewFlowName(e.target.value)}
            aria-label="Flow name"
            className="h-10"
          />
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !newFlowName.trim()}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating…
                </>
              ) : (
                "Create Flow"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
