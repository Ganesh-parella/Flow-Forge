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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

  if (flows.length === 0) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center">
        <img src="/empty-flows.svg" alt="No flows" className="w-28 opacity-80" />
        <h2 className="text-lg font-semibold text-muted-foreground">No flows found</h2>
        <p className="text-muted-foreground mb-2">Start by creating your first flow.</p>
        <button type="button" onClick={onCreate} className="btn-primary">
          Create Flow
        </button>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {flows.map((flow) => (
        <FlowCard
          key={flow.Id}
          flow={flow}
          onEdit={onEdit}
          onDelete={onDelete}
          onRun={onRun}
          deleting={deletingFlowId === flow.Id}
          running={runningFlowId === flow.Id}
        />
      ))}
    </div>
  );
}