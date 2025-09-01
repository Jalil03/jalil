import { useState } from "react";

export default function SimpleNavbar({ onNavigate, route }) {
  const [open, setOpen] = useState(false);

  const NavLink = ({ id, label }) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.(id);
        setOpen(false);
      }}
      className={`block px-3 py-2 rounded-md transition ${
        route === id ? "text-accent font-semibold" : "text-subtext hover:text-text"
      }`}
    >
      {label}
    </a>
  );

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-base">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.("home");
          }}
          className="font-extrabold tracking-tight text-text"
        >
          JL<span className="text-accent">.</span>
        </a>

        {/* Hamburger (shown on small/medium) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg border border-base text-subtext"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>

        {/* Desktop links */}
        <nav className="hidden md:flex gap-6">
          <NavLink id="home" label="Home" />
          <NavLink id="projects" label="Projects" />
          <NavLink id="about" label="About" />
          <NavLink id="contact" label="Contact" />
        </nav>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-card border-t border-base px-4 py-3 space-y-2">
          <NavLink id="home" label="Home" />
          <NavLink id="projects" label="Projects" />
          <NavLink id="about" label="About" />
          <NavLink id="contact" label="Contact" />
        </div>
      )}
    </header>
  );
}
