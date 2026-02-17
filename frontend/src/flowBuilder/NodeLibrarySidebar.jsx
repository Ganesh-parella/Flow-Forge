import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Button,
} from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
  Zap,
  Mail,
  Clock,
  Sheet as SheetIcon,
  ChevronRight,
} from "lucide-react";

const Section = ({ title, children }) => (
  <div className="mb-6">
    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{title}</p>
    <div>{children}</div>
  </div>
);

const NodeItem = ({ icon, label, type, data, onDragStart }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, type, data)}
    className="flex items-center gap-3 bg-white border shadow-sm hover:shadow-xl p-3 mb-2 rounded-lg cursor-grab transition"
    role="button"
    tabIndex={0}
    title={label}
  >
    <span className="text-2xl">{icon}</span> <span className="font-medium">{label}</span>
  </div>
);

function NodeLibrarySidebar({ onDragStart, open, onClose }) {
  const sidebarContent = (
    <nav className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-6 text-primary">Node Library</h2>
      <Section title="Triggers">
        <NodeItem icon={<Zap />} label="Webhook Trigger" type="trigger" data={{ eventType: "Webhook Received" }} onDragStart={onDragStart} />
      </Section>
      <Section title="Actions">
        <NodeItem
          icon={<Mail />}
          label="Send Gmail"
          type="gmail-send-action"
          data={{ label: "Send Gmail", to: "", subject: "", body: "" }}
          onDragStart={onDragStart}
        />
        <NodeItem
          icon={<SheetIcon />}
          label="Add Row to Sheet"
          type="google-sheets-add-row-action"
          data={{ label: "Add Row to Sheet", spreadsheetId: "", sheetName: "", rowValues: "" }}
          onDragStart={onDragStart}
        />
        <NodeItem
          icon={<Clock />}
          label="Delay"
          type="delay-action"
          data={{ label: "Delay", durationMs: 1000 }}
          onDragStart={onDragStart}
        />
      </Section>
    </nav>
  );

  return (
    <>
      <aside className="hidden md:block bg-muted border-r w-64 min-w-[15rem] max-w-xs  py-8 px-4 shadow-sm">{sidebarContent}</aside>
      {open && (
        <Sheet open={open} onOpenChange={onClose}>
          <SheetContent side="left" className="w-[250px] p-4">{sidebarContent}</SheetContent>
        </Sheet>
      )}
    </>
  );
}

export default NodeLibrarySidebar;
