import React from "react";
import { Card } from "@/components/ui/card";
import { Trash2, Play, Pencil } from "lucide-react";

export default function FlowCard({
  flow,
  onEdit,
  onDelete,
  onRun,
  deleting,
  running,
}) {
  return (
    <Card className="p-5 flex flex-col justify-between hover:shadow-lg transition-all">
      {/* Flow Info */}
      <div>
        <h3 className="text-lg font-semibold mb-2 truncate">
          {flow.name || `Flow ${flow.Id}`}
        </h3>

        <p className="text-sm text-muted-foreground">
          Created{" "}
          {flow.createdAt
            ? new Date(flow.createdAt).toLocaleDateString()
            : "—"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3 mt-6">
        <button
          onClick={() => onEdit(flow)}
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRun(flow.Id);
          }}
          disabled={running}
          className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition"
        >
          <Play className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(flow.Id);
          }}
          disabled={deleting}
          className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}