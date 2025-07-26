import React from "react";
import { Link, useLocation } from "react-router-dom";
import { List, Link2, Settings } from "lucide-react";
import { FileText } from "lucide-react";
const NAV_LINKS = [
  { name: "Dashboard", path: "/flows", icon: List },
  { name: "Integrations", path: "/integrations", icon: Link2 },
  { name: "Demo-Form", path: "/trigger-demo",icon: FileText }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col bg-muted border-r w-56 min-w-[14rem]  py-6 px-4">
      <div className="mb-12">
        <span className="text-2xl font-bold tracking-tight text-primary">FlowForge</span>
      </div>
      <nav className="flex flex-col gap-1" aria-label="Primary">
        {NAV_LINKS.map(({ name, path, icon: Icon }) => (
          <Link
            key={name}
            to={path}
            className={`flex items-center gap-3 py-2 px-3 rounded-lg text-base font-medium transition hover:bg-accent/60 hover:text-primary ${
              location.pathname === path ? "bg-accent text-primary font-semibold" : "text-muted-foreground"
            }`}
            aria-current={location.pathname === path ? "page" : undefined}
          >
            {Icon && <Icon className="w-5 h-5" />} {name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
