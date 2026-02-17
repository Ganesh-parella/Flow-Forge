import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

export default function Header() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isLandingPage = location.pathname === "/";

  useEffect(() => {
    if (!isLandingPage) return;

    const onScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLandingPage]);

  const headerClass = `
    w-full z-50 transition-all duration-300 backdrop-blur bg-opacity-90
    ${isLandingPage
      ? scrolled
        ? "fixed top-0 bg-white/90 text-gray-900 shadow-md border-b border-gray-200"
        : "fixed top-0 bg-transparent text-white"
      : "sticky top-0 bg-white text-gray-900 shadow-md border-b border-gray-200"}
  `;

  return (
    <header
      className={headerClass}
      role="banner"
      style={{ height: 80 }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo and Site Title */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-violet-500"
          aria-label="Go to Home"
          type="button"
        >
          
            <img
              src="/logo.svg"
              alt="Auto Task Builder Logo"
              className="p-0"
              style={{ height: 130, width: "auto" }}
              draggable={false}
            />
          
        </button>

        {/* Navigation / Auth Buttons */}
        <nav
          className="flex gap-3 items-center"
          role="navigation"
          aria-label="Primary"
        >
          {isSignedIn ? (
            <>
              <Button
                variant="ghost"
                className={`font-medium rounded-full 
                  ${isLandingPage && !scrolled
                    ? "text-gray-900 hover:text-violet-200 hover:bg-white/10"
                    : "text-gray-900 hover:text-violet-700 hover:bg-violet-50"
                  } 
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-violet-500
                `}
                onClick={() => navigate("/flows")}
                aria-label="Go to Dashboard"
              >
                Dashboard
              </Button>
              <UserButton />
            </>
          ) : (
            <Button
              onClick={() => navigate("/sign-in")}
              className="bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform rounded-full px-7 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-violet-500"
            >
              Get Started
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
