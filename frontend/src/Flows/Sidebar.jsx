import React from "react";
import { Link, useLocation } from "react-router-dom";
import { List, Link2, FileText } from "lucide-react";

const NAV_LINKS = [
  { name: "Dashboard", path: "/flows", icon: List },
  { name: "Integrations", path: "/integrations", icon: Link2 },
  { name: "Demo Form", path: "/trigger-demo", icon: FileText },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col bg-background border-r w-56 min-w-[14rem] py-6 px-4 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex flex-col gap-1" aria-label="Primary navigation">
        {NAV_LINKS.map(({ name, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={name}
              to={path}
              aria-current={active ? "page" : undefined}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                ${active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                  active ? "text-primary" : ""
                }`}
              />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}