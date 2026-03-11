import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Menu, X, List, Link2, FileText } from "lucide-react";

const APP_NAV_LINKS = [
  { name: "Flows", path: "/flows", icon: List },
  { name: "Integrations", path: "/integrations", icon: Link2 },
  { name: "Demo Form", path: "/trigger-demo", icon: FileText },
];

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    if (!isLandingPage) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLandingPage]);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const headerClass = `
    w-full z-50 transition-all duration-300
    ${isLandingPage
      ? scrolled
        ? "fixed top-0 bg-white text-neutral-900 shadow-sm border-b border-neutral-200"
        : "fixed top-0 bg-transparent text-neutral-900"
      : "sticky top-0 bg-white text-neutral-900 shadow-sm border-b border-neutral-200"}
  `;

  return (
    <>
      <header className={headerClass} role="banner">
        {/* INCREASED HEADER HEIGHT to h-20 sm:h-24 to give the logo maximum room */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex justify-between items-center">
          
          <div className="flex items-center gap-2 sm:gap-4 h-full py-2">
            {isSignedIn && !isLandingPage && (
              <button 
                className="md:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900 focus-visible:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}

            <button
              onClick={() => navigate("/")}
              className="flex items-center h-full cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-transform hover:scale-[1.02]"
              aria-label="Go to Home"
              type="button"
            >
              {/* Image spans the full height of the container */}
              <img
                src="/logo.svg"
                alt="FlowForge Logo"
                className="h-full w-auto object-contain"
                draggable={false}
              />
            </button>
          </div>

          <nav className="flex items-center gap-3 sm:gap-4" role="navigation" aria-label="Primary">
            {isLoaded && isSignedIn ? (
              <>
                <Button
                  variant="ghost"
                  className={`hidden sm:inline-flex font-medium rounded-full transition-colors
                    ${isLandingPage && !scrolled
                      ? "text-neutral-700 hover:text-violet-700 hover:bg-black/5"
                      : "text-neutral-600 hover:text-violet-700 hover:bg-violet-50"
                    } 
                  `}
                  onClick={() => navigate("/flows")}
                >
                  Dashboard
                </Button>
                <div className="pl-2 border-l border-neutral-200">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </>
            ) : isLoaded ? (
              <Button
                onClick={() => navigate("/auth/sign-in")}
                className="bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 rounded-full px-6 py-2"
              >
                Get Started
              </Button>
            ) : null}
          </nav>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && isSignedIn && !isLandingPage && (
        <div className="fixed inset-0 top-20 sm:top-24 bg-white z-40 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col p-4 gap-2">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-4">
              Menu
            </div>
            {APP_NAV_LINKS.map(({ name, path, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={name}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-colors
                    ${active ? "bg-violet-50 text-violet-700" : "text-neutral-600 hover:bg-neutral-50"}
                  `}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-violet-600" : ""}`} />
                  {name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}