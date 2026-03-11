import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Zap, Mail, Clock, Sheet as SheetIcon, Library } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <div className="mb-5">
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">
      {title}
    </p>
    <div className="space-y-1.5">{children}</div>
  </div>
);

const NodeItem = ({ icon, label, description, type, data, onDragStart, onTapToAdd }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, type, data)}
    onClick={() => onTapToAdd(type, data)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        onTapToAdd(type, data);
      }
    }}
    aria-label={`Add ${label} node`}
    title={description}
    className="
      group flex items-center gap-3
      bg-background border border-border/60 rounded-lg
      px-3 py-2.5 cursor-grab
      hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm
      active:cursor-grabbing active:scale-95
      transition-all duration-150 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
    "
  >
    <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-150">
      {icon}
    </div>
    <span className="text-sm font-medium leading-tight">{label}</span>
  </div>
);

// ─── Node Definitions ─────────────────────────────────────────────────────────

const NODE_DEFS = {
  triggers: [
    {
      icon: <Zap className="w-3.5 h-3.5 text-amber-500" />,
      label: "Webhook Trigger",
      description: "Start this flow when an HTTP POST is received",
      type: "trigger",
      data: { label: "Webhook Trigger", eventType: "Webhook Received" },
    },
  ],
  actions: [
    {
      icon: <Mail className="w-3.5 h-3.5 text-blue-500" />,
      label: "Send Gmail",
      description: "Send an email via Gmail",
      type: "gmail-send-action",
      data: { label: "Send Gmail", to: "", subject: "", body: "" },
    },
    {
      icon: <SheetIcon className="w-3.5 h-3.5 text-green-600" />,
      label: "Add Row to Sheet",
      description: "Append a row to a Google Sheet",
      type: "google-sheets-add-row-action",
      data: { label: "Add Row to Sheet", spreadsheetId: "", sheetName: "", rowValues: "" },
    },
    {
      icon: <Clock className="w-3.5 h-3.5 text-violet-500" />,
      label: "Delay",
      description: "Pause execution for a set duration",
      type: "delay-action",
      data: { label: "Delay", durationMs: 1000 },
    },
  ],
};

// ─── Sidebar Content ──────────────────────────────────────────────────────────

function SidebarContent({ onDragStart, onTapToAdd }) {
  return (
    <nav className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-6 px-1">
        <Library className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Node Library</h2>
      </div>

      <Section title="Triggers">
        {NODE_DEFS.triggers.map((node) => (
          <NodeItem 
            key={node.type} 
            {...node} 
            onDragStart={onDragStart} 
            onTapToAdd={onTapToAdd} 
          />
        ))}
      </Section>

      <Section title="Actions">
        {NODE_DEFS.actions.map((node) => (
          <NodeItem 
            key={node.type} 
            {...node} 
            onDragStart={onDragStart} 
            onTapToAdd={onTapToAdd} 
          />
        ))}
      </Section>

      <p className="text-[10px] text-muted-foreground text-center mt-auto pt-6 px-1">
        Drag or tap nodes to add them
      </p>
    </nav>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

function NodeLibrarySidebar({ onDragStart, onTapToAdd, open, onClose }) {
  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden md:flex flex-col bg-muted/30 border-r w-56 min-w-[14rem] max-w-xs py-6 px-4 shrink-0">
        <SidebarContent onDragStart={onDragStart} onTapToAdd={onTapToAdd} />
      </aside>

      {/* Mobile sheet */}
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-5">
          <SheetHeader className="sr-only">
            <SheetTitle>Node Library</SheetTitle>
          </SheetHeader>
          <SidebarContent onDragStart={onDragStart} onTapToAdd={onTapToAdd} />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default NodeLibrarySidebar;