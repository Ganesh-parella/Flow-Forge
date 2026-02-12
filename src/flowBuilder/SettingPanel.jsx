import React, { useState } from "react";
import {
  Button
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Input
} from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { Copy } from "lucide-react";

function SettingsPanel({ node, updateNodeData, flowId }) {
  if (!node) return null;

  const [copySuccess, setCopySuccess] = useState("");
  const webhookUrl = `https://localhost:7025/api/webhooks/${flowId}`;

  return (
    <Card className="absolute right-7 top-20 w-80 max-w-[94vw] bg-white border shadow-xl z-40 animate-in slide-in-from-right fade-in duration-200">
      <CardHeader>
        <CardTitle className="mb-1">{node.data.label || node.type[0].toUpperCase() + node.type.slice(1)} Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {node.type === "trigger" && (
          <div>
            <p className="text-xs mb-1 font-medium">Webhook URL</p>
            {flowId ? (
              <div className="flex gap-2 items-center">
                <Input value={webhookUrl} readOnly className="bg-gray-50 cursor-pointer" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => {
                        navigator.clipboard.writeText(webhookUrl);
                        setCopySuccess("Copied!");
                        setTimeout(() => setCopySuccess(""), 1200);
                      }}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy URL</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground rounded bg-gray-100 p-2">Save the flow to generate a unique webhook URL.</p>
            )}
            {copySuccess && <span className="text-xs text-green-500 ml-2">{copySuccess}</span>}
          </div>
        )}
        {node.type === "gmail-send-action" && (
          <div className="space-y-2">
            <label className="text-xs font-medium">To</label>
            <Input value={node.data.to || ""} onChange={e => updateNodeData(d => ({ ...d, to: e.target.value }))} placeholder="recipient@example.com" />
            <label className="text-xs font-medium">Subject</label>
            <Input value={node.data.subject || ""} onChange={e => updateNodeData(d => ({ ...d, subject: e.target.value }))} placeholder="Your Subject" />
            <label className="text-xs font-medium">Body</label>
           <Textarea rows={3} value={node.data.body || ""} onChange={e => updateNodeData(d => ({ ...d, body: e.target.value }))} placeholder="Email content..." />
          </div>
        )}
        {node.type === "delay-action" && (
          <div className="space-y-2">
            <label className="text-xs font-medium">Duration (milliseconds)</label>
            <Input type="number" value={node.data.durationMs || 1000} onChange={e => updateNodeData(d => ({ ...d, durationMs: parseInt(e.target.value, 10) || 0 }))} placeholder="e.g., 5000" />
          </div>
        )}
        {node.type === "google-sheets-add-row-action" && (
          <div className="space-y-2">
            <label className="text-xs font-medium">Spreadsheet ID</label>
            <Input value={node.data.spreadsheetId || ""} onChange={e => updateNodeData(d => ({ ...d, spreadsheetId: e.target.value }))} placeholder="e.g., 1BxiMVs0XRA5nFMd..." />
            <label className="text-xs font-medium">Sheet Name</label>
            <Input value={node.data.sheetName || ""} onChange={e => updateNodeData(d => ({ ...d, sheetName: e.target.value }))} placeholder="e.g., Sheet1" />
            <label className="text-xs font-medium">Row Values (comma-separated)</label>
            <Textarea rows={3} value={node.data.rowValues || ""} onChange={e => updateNodeData(d => ({ ...d, rowValues: e.target.value }))} placeholder="e.g., Value A, {{payload.email}}" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SettingsPanel;
