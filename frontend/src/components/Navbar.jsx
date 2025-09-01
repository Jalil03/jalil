// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function NavItem({ id, label, route, onNavigate, close }) {
  const active = route === id;
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.(id);
        close?.();
      }}
      className={`transition ${active ? "text-accent font-semibold" : "text-subtext hover:text-text"}`}
    >
      {label}
    </a>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="text-subtext" aria-hidden="true">
      <path fill="currentColor" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="text-subtext" aria-hidden="true">
      <path fill="currentColor" d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" />
    </svg>
  );
}

/* Monochrome theme icons */
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export default function Navbar({ onNavigate, route }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ---- theme toggle state ----
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved) setIsDark(saved === "dark");
    else setIsDark(document.documentElement.classList.contains("theme-dark"));
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("theme-dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("theme-dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // ---- lock scroll + ESC to close when mobile sheet is open ----
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevHtml || "";
      body.style.overflow = prevBody || "";
    };
  }, [open]);

  const closeMobile = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-base backdrop-blur-md bg-[var(--header-tint)]">
        <nav className="container flex items-center justify-between h-14">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.("home");
              closeMobile();
            }}
            className="font-extrabold tracking-tight text-text"
            aria-label="Home"
          >
            JL<span className="text-accent">.</span>
          </a>

          {/* Desktop links (lg+) */}
          <div className="hidden lg:flex items-center gap-6">
            <NavItem id="home" label="Home" route={route} onNavigate={onNavigate} />
            <NavItem id="projects" label="Projects" route={route} onNavigate={onNavigate} />
            <NavItem id="about" label="About" route={route} onNavigate={onNavigate} />
            <NavItem id="contact" label="Contact" route={route} onNavigate={onNavigate} />
          </div>

          {/* Right actions (lg+) */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setIsDark((d) => !d)}
              className="icon-btn"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Light" : "Dark"}
              style={{ fontSize: 18, lineHeight: 1 }}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <a href="https://github.com/Jalil03" target="_blank" rel="noreferrer" className="link-pill">
              GitHub
            </a>
            <a href="/cv.pdf" target="_blank" rel="noreferrer" className="link-pill">
              CV
            </a>
          </div>

          {/* Hamburger (sm/md) */}
          <button
            className="lg:hidden p-2 rounded-lg border border-base"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>
      </header>

      {/* ---- Mobile overlay rendered to <body> ---- */}
      {mounted && open &&
        createPortal(
          <div id="mobile-menu" className="fixed inset-0 z-[10000]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/35 backdrop-blur-2xl" onClick={closeMobile} />

            {/* Centered sheet */}
            <div className="relative z-10 min-h-[100dvh] flex items-center justify-center p-4">
              <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-sm rounded-2xl border border-base bg-[color-mix(in_srgb,var(--bg-base)_92%,transparent)] shadow-2xl max-h=[calc(100dvh-2rem)] overflow-auto"
              >
                {/* Top row */}
                <div className="flex items-center justify-between p-4 border-b border-base sticky top-0 bg-[color-mix(in_srgb,var(--bg-base)_92%,transparent)]">
                  <div className="font-extrabold tracking-tight text-text">
                    JL<span className="text-accent">.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsDark((d) => !d)}
                      className="icon-btn"
                      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                      title={isDark ? "Light" : "Dark"}
                      style={{ fontSize: 18, lineHeight: 1 }}
                    >
                      {isDark ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <button className="icon-btn" onClick={closeMobile} aria-label="Close menu">
                      <CloseIcon />
                    </button>
                  </div>
                </div>

                {/* Links */}
                <nav className="px-6 py-6 grid gap-5 text-center text-xl">
                  <NavItem id="home" label="Home" route={route} onNavigate={onNavigate} close={closeMobile} />
                  <NavItem id="projects" label="Projects" route={route} onNavigate={onNavigate} close={closeMobile} />
                  <NavItem id="about" label="About" route={route} onNavigate={onNavigate} close={closeMobile} />
                  <NavItem id="contact" label="Contact" route={route} onNavigate={onNavigate} close={closeMobile} />
                </nav>

                {/* Bottom actions */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-center gap-3">
                  <a href="https://github.com/Jalil03" target="_blank" rel="noreferrer" className="link-pill">
                    GitHub
                  </a>
                  <a href="/cv.pdf" target="_blank" rel="noreferrer" className="link-pill">
                    CV
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
