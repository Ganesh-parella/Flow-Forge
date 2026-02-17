import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Handle, Position } from "reactflow";

export default function GoogleSheetsAddRowNode({ data, selected }) {
  return (
    <Card className={`border-blue-500 border-2 shadow-md w-48 relative ${selected ? "ring-2 ring-blue-500" : ""}`}>
      <CardHeader className="pb-1">
        <CardTitle className="text-blue-700 text-md">{data?.label || "Add Row to Sheet"}</CardTitle>
      </CardHeader>
      <CardContent className="flex pt-2 pb-1">
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
      </CardContent>
    </Card>
  );
}
