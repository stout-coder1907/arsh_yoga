import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Programs" },
  { to: "/journal", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-line/70 bg-sand/85 backdrop-blur sticky top-0 z-40">
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Arsh Yoga" className="h-9 w-9" />
          <span className="font-serif text-2xl text-forest tracking-tight">Arsh Yoga</span>
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-sm text-charcoal/80">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `transition-colors hover:text-forest ${isActive ? "text-forest font-medium" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to={user?.role === "admin" ? "/admin" : "/dashboard"} className="text-sm text-forest hover:underline">
                Hi, {user?.name?.split(" ")[0] || "Friend"}
              </Link>
              <button onClick={logout} className="btn-ghost !py-2 !px-5 text-xs">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline text-sm text-forest hover:underline">Sign in</Link>
              <Link to="/register" className="btn-primary !py-2.5 !px-5 text-xs">Enroll now</Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((s) => !s)}
            className="md:hidden p-2 rounded-lg hover:bg-forest/5 ml-2"
            aria-label="Toggle navigation"
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H20" stroke="#1F2937" strokeWidth="2" />
              <path d="M0 7H20" stroke="#1F2937" strokeWidth="2" />
              <path d="M0 13H20" stroke="#1F2937" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden bg-sand border-t border-line/70">
          <div className="container-x py-4 flex flex-col gap-3">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm text-charcoal/80 transition-colors ${isActive ? "text-forest font-medium" : "hover:text-forest"}`
                }
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
