import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Copy, Check, X, Settings2 } from "lucide-react";

const WEBHOOK_BASE_URL =
  import.meta.env.VITE_WEBHOOK_BASE_URL ||
  "https://flow-forge-2txl.onrender.com/api/webhooks";

function SettingsPanel({ node, updateNodeData, flowId, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!node) return null;

  const webhookUrl = `${WEBHOOK_BASE_URL}/${flowId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const title =
    node.data.label ||
    node.type.charAt(0).toUpperCase() + node.type.slice(1).replace(/-/g, " ");

  return (
    <Card
      className="
        absolute bottom-4 left-4 right-4
        md:bottom-auto md:left-auto md:right-5 md:top-[4.5rem] md:w-80
        bg-white border shadow-xl z-50
        max-h-[55vh] md:max-h-[calc(100vh-6rem)]
        overflow-y-auto
        animate-in fade-in-0 slide-in-from-bottom-4 md:slide-in-from-right-4 duration-200
        rounded-xl
      "
    >
      {/* Header */}
      <CardHeader className="sticky top-0 bg-white z-10 p-4 border-b flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Settings2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <CardTitle className="text-sm font-semibold truncate">{title}</CardTitle>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Close settings"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-4">

        {/* ── Webhook Trigger ── */}
        {node.type === "trigger" && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Webhook URL</label>
            {flowId ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={webhookUrl}
                  readOnly
                  className="bg-muted/50 text-xs font-mono cursor-text flex-1"
                  aria-label="Webhook URL"
                />
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopy}
                        className="shrink-0 h-9 w-9 transition-all duration-150"
                        aria-label="Copy webhook URL"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      {copied ? "Copied!" : "Copy URL"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2.5">
                Save the flow first to generate a unique webhook URL.
              </p>
            )}
          </div>
        )}

        {/* ── Gmail Action ── */}
        {node.type === "gmail-send-action" && (
          <div className="space-y-3">
            <Field label="To">
              <Input
                value={node.data.to || ""}
                onChange={(e) => updateNodeData((d) => ({ ...d, to: e.target.value }))}
                placeholder="recipient@example.com"
              />
            </Field>
            <Field label="Subject">
              <Input
                value={node.data.subject || ""}
                onChange={(e) => updateNodeData((d) => ({ ...d, subject: e.target.value }))}
                placeholder="Email subject"
              />
            </Field>
            <Field label="Body">
              <Textarea
                rows={4}
                value={node.data.body || ""}
                onChange={(e) => updateNodeData((d) => ({ ...d, body: e.target.value }))}
                placeholder="Email content… Use {{payload.field}} for dynamic values."
                className="resize-none text-sm"
              />
            </Field>
          </div>
        )}

        {/* ── Delay Action ── */}
        {node.type === "delay-action" && (
          <Field label="Duration (milliseconds)">
            <Input
              type="number"
              min={0}
              value={node.data.durationMs ?? 1000}
              onChange={(e) =>
                updateNodeData((d) => ({ ...d, durationMs: parseInt(e.target.value, 10) || 0 }))
              }
              placeholder="e.g. 5000"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              {((node.data.durationMs || 0) / 1000).toFixed(1)}s
            </p>
          </Field>
        )}

        {/* ── Google Sheets Action ── */}
        {node.type === "google-sheets-add-row-action" && (
          <div className="space-y-3">
            <Field label="Spreadsheet ID">
              <Input
                value={node.data.spreadsheetId || ""}
                onChange={(e) =>
                  updateNodeData((d) => ({ ...d, spreadsheetId: e.target.value }))
                }
                placeholder="1BxiMVs0XRA5nFMd…"
                className="font-mono text-xs"
              />
            </Field>
            <Field label="Sheet Name">
              <Input
                value={node.data.sheetName || ""}
                onChange={(e) => updateNodeData((d) => ({ ...d, sheetName: e.target.value }))}
                placeholder="Sheet1"
              />
            </Field>
            <Field label="Row Values (comma-separated)">
              <Textarea
                rows={3}
                value={node.data.rowValues || ""}
                onChange={(e) => updateNodeData((d) => ({ ...d, rowValues: e.target.value }))}
                placeholder="Value A, {{payload.email}}, Value C"
                className="resize-none text-sm"
              />
            </Field>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Small helper for consistent field layout
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

export default SettingsPanel;
