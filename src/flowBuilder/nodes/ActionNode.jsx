import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Handle, Position } from "reactflow";

export default function ActionNode({ data }) {
  return (
    <Card className="border-gray-400 border-2 shadow-md w-48 relative">
      <CardHeader className="pb-1">
        <CardTitle className="text-gray-700 text-md">{data?.label || "Action"}</CardTitle>
      </CardHeader>
      <CardContent className="flex pt-2 pb-1">
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
      </CardContent>
    </Card>
  );
}
