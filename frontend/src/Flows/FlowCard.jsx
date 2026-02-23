import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Play, Trash, Loader2 } from "lucide-react";

export default function FlowCard({
  flow,
  onEdit,
  onRun,
  onDelete,
  deleting,
  running,
}) {
  return (
    <Card className="group relative overflow-visible p-0 border hover:shadow-lg shadow transition-all duration-200">
      <CardHeader
        onClick={() => onEdit(flow)} // Passing the whole object for editing is fine!
        className="flex flex-row items-center justify-between gap-2 bg-accent/30 p-4 rounded-t-lg cursor-pointer"
      >
        <CardTitle className="truncate text-lg font-semibold">
          {/* FIXED: flow.Id */}
          {flow.name || `Flow ${flow.Id}`}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-60 hover:bg-accent/90 focus:bg-accent p-0 h-8 w-8"
              /* FIXED: flow.Id */
              aria-label={`Open menu for ${flow.name || `flow ${flow.Id}`}`}
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-xl">
            <DropdownMenuItem onClick={() => onEdit(flow)}>
              <Edit className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            
            {/* FIXED: onRun(flow.Id) */}
            <DropdownMenuItem onClick={() => onRun(flow.Id)} disabled={running}>
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </>
              )}
            </DropdownMenuItem>
            
            {/* FIXED: onDelete(flow.Id) */}
            <DropdownMenuItem
              onClick={() => onDelete(flow.Id)}
              disabled={deleting}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="px-4 pb-6 pt-4 flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">
          Last updated:{" "}
          {flow.updatedAt
            ? new Date(flow.updatedAt).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </span>
      </CardContent>
    </Card>
  );
}