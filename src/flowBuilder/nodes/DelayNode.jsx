import React, { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Handle, Position } from "reactflow";
import { Input } from "@/components/ui/input";

export default function DelayNode({ data }) {
  const [localDuration, setLocalDuration] = useState(data.durationMs || 1000);

  useEffect(() => {
    setLocalDuration(data.durationMs || 1000);
  }, [data.durationMs]);

  const onChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setLocalDuration(val);
      data.onChange && data.onChange({ ...data, durationMs: val });
    }
  };

  return (
    <Card className="border-orange-500 border-2 shadow-md w-52 relative p-4">
      <CardTitle className="text-orange-600 mb-2">Delay Node</CardTitle>
      <Input
        aria-label="Delay duration in milliseconds"
        type="number"
        min={0}
        value={localDuration}
        onChange={onChange}
        className="mb-1"
      />
      <small className="text-gray-500">Duration (ms)</small>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-orange-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-orange-500" />
    </Card>
  );
}
