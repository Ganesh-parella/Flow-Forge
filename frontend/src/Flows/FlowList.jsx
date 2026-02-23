import React from "react";
import FlowCard from "./FlowCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const dummyArray = Array(6).fill(0);

export default function FlowsList({
  flows,
  loading,
  deletingFlowId,
  runningFlowId,
  onEdit,
  onDelete,
  onRun,
  onCreate,
}) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dummyArray.map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-end mt-6">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!flows || flows.length === 0) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="text-lg font-semibold text-muted-foreground">
          No flows found
        </h2>
        <p className="text-muted-foreground">
          Start by creating your first flow.
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Create Flow
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {flows.map((flow) => (
        <FlowCard
          key={flow.id}
          flow={flow}
          onEdit={onEdit}
          onDelete={onDelete}
          onRun={onRun}
          deleting={deletingFlowId === flow.id}
          running={runningFlowId === flow.id}
        />
      ))}
    </div>
  );
}