import React, { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Handle, Position } from "reactflow";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function GoogleSheetsAddRowNode({ data }) {
  const [localData, setLocalData] = useState({
    spreadsheetId: data.spreadsheetId || "",
    sheetName: data.sheetName || "",
    rowValues: data.rowValues || "",
  });

  useEffect(() => {
    setLocalData({
      spreadsheetId: data.spreadsheetId || "",
      sheetName: data.sheetName || "",
      rowValues: data.rowValues || "",
    });
  }, [data.spreadsheetId, data.sheetName, data.rowValues]);

  const updateField = (key, value) => {
    const updated = { ...localData, [key]: value };
    setLocalData(updated);
    data.onChange && data.onChange(updated);
  };

  return (
    <Card className="border-blue-500 border-2 shadow-md w-64 relative p-4">
      <CardTitle className="text-blue-600 mb-2">Google Sheets: Add Row</CardTitle>

      <label className="block text-xs font-medium mb-1" htmlFor="spreadsheetId">Spreadsheet ID</label>
      <Input
        id="spreadsheetId"
        aria-label="Spreadsheet ID"
        placeholder="e.g., 1BxiMVs0XRA5nFMd..."
        value={localData.spreadsheetId}
        onChange={(e) => updateField("spreadsheetId", e.target.value)}
        className="mb-2"
      />

      <label className="block text-xs font-medium mb-1" htmlFor="sheetName">Sheet Name</label>
      <Input
        id="sheetName"
        aria-label="Sheet Name"
        placeholder="e.g., Sheet1"
        value={localData.sheetName}
        onChange={(e) => updateField("sheetName", e.target.value)}
        className="mb-2"
      />

      <label className="block text-xs font-medium mb-1" htmlFor="rowValues">
        Row Values (comma-separated or use {"{{variable}}"})
      </label>
      <Textarea
        id="rowValues"
        aria-label="Row Values"
        rows={3}
        placeholder="e.g., Value1, Value2, {{payload.someValue}}"
        value={localData.rowValues}
        onChange={(e) => updateField("rowValues", e.target.value)}
      />

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </Card>
  );
}
