import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Handle, Position } from "reactflow";

export default function TriggerNode({ data }) {
  return (
    <Card className="border-purple-500 border-2 shadow-md w-48 relative">
      <CardHeader className="pb-1">
        <CardTitle className="text-purple-700 text-md">Trigger</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">{data?.eventType || "Choose an event"}</p>
      </CardHeader>
      <CardContent className="flex justify-center pt-0 pb-1">
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500" />
      </CardContent>
    </Card>
  );
}
