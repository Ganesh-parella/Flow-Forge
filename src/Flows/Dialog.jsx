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
import { Loader2 } from "lucide-react";

export function DeleteDialog({ open, onClose, onConfirm, isLoading, flowName }) {
  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Flow</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{flowName}</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Deleting...
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

export function RunDialog({ open, onClose, message }) {
  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Flow Execution Result</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CreateDialog({ open, onClose, onCreate, isLoading, newFlowName, setNewFlowName }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate();
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Flow</DialogTitle>
          <DialogDescription>Give your flow a recognizable name.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            placeholder="Flow name"
            value={newFlowName}
            disabled={isLoading}
            onChange={(e) => setNewFlowName(e.target.value)}
            aria-label="Flow name input"
            className="w-full rounded border p-2"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !newFlowName.trim()}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
