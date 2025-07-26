import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Handle, Position } from "reactflow";

export default function ConditionNode({ data }) {
  const c = data?.condition || {};
  return (
    <Card className="border-green-500 border-2 shadow-md w-48 relative">
      <CardHeader className="pb-1">
        <CardTitle className="text-green-700 text-md">Condition</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          {c.left || "var"} {c.op || "=="} {c.right || "value"}
        </p>
      </CardHeader>
      <CardContent className="relative flex items-center pt-2 pb-1">
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-green-500" />
        <span className="absolute -left-6 top-5 text-xs text-blue-500 font-bold">T</span>
        <Handle id="true" type="source" position={Position.Left} className="w-3 h-3 bg-blue-500" />
        <span className="absolute -right-6 top-5 text-xs text-red-500 font-bold">F</span>
        <Handle id="false" type="source" position={Position.Right} className="w-3 h-3 bg-red-500" />
      </CardContent>
    </Card>
  );
}
