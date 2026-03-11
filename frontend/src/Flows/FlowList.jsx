import React from 'react';
import FlowCard from './FlowCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Workflow } from 'lucide-react';

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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card
            key={i}
            className="p-5 border border-border/40"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <Skeleton className="h-5 w-2/3" />
            </div>
            <Skeleton className="h-3 w-1/3 ml-11" />
          </Card>
        ))}
      </div>
    );
  }

  if (flows.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <Workflow className="w-7 h-7 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">No flows yet</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Build your first automated workflow to get started.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Create your first flow
        </button>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {flows.map((flow, i) => (
        <div
          key={flow.id}
          className="animate-in fade-in-0 slide-in-from-bottom-3 duration-300 fill-mode-both"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <FlowCard
            flow={flow}
            onEdit={onEdit}
            onDelete={onDelete}
            onRun={onRun}
            deleting={deletingFlowId === flow.id}
            running={runningFlowId === flow.id}
          />
        </div>
      ))}
    </div>
  );
}