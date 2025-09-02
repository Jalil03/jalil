import { useEffect } from "react";

/* --- small primitives (token-based) --- */
function Btn({ variant = "primary", children, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl text-sm h-9 px-3 transition outline-none focus:ring-2 ring-primary";
  const variants = {
    primary: "bg-primary hover:brightness-110",
    ghost:   "border border-base bg-elevated text-text hover:bg-elevated/80",
    icon:    "border border-base bg-elevated text-text hover:bg-elevated/80 h-9 w-9 p-0",
  };
  return (
    <button {...props} className={`${base} ${variants[variant] || variants.primary}`}>
      {children}
    </button>
  );
}

function Chip({ children }) {
  if (!children) return null;
  return (
    <span className="shrink-0 rounded-full px-2.5 py-1 text-xs border border-base bg-elevated/60 text-text">
      {children}
    </span>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm leading-relaxed">
      <span className="shrink-0 min-w-24 text-subtext">{label}</span>
      <span className="text-text break-words">{value}</span>
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div className="p-4 rounded-2xl shadow-sm border border-base bg-elevated/70">
      <div className="font-semibold mb-3">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/* --- modal --- */
export default function ProjectDetailsModal({ open, onClose, p }) {
  // ESC to close
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const hasDetails = !!(p?.modelCard || p?.dataCard || p?.metrics);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
      aria-hidden="true"
    >
      {/* centered panel, not full-screen */}
      <div
        className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl border border-base bg-surface text-text"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${p?.title} details`}
      >
        {/* header */}
        <div className="sticky top-0 z-10 px-5 py-4 border-b border-base bg-surface-95 flex items-center gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold truncate">{p?.title}</h3>
            {p?.subtitle && (
              <p className="text-sm text-subtext truncate">{p.subtitle}</p>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {p?.github && (
              <a href={p.github} target="_blank" rel="noreferrer" className="hidden md:block">
                <Btn variant="ghost">GitHub</Btn>
              </a>
            )}
            <Btn aria-label="Close" variant="icon" onClick={onClose}>✕</Btn>
          </div>
        </div>

        {/* body */}
        <div className="max-h-[calc(85vh-4rem)] overflow-y-auto p-5 space-y-5">
          {/* cover */}
          {p?.cover && (
            <div className="overflow-hidden rounded-2xl border border-base">
              <img
                src={p.cover}
                alt=""
                className="w-full h-44 md:h-56 object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* tags */}
          {Array.isArray(p?.tags) && p.tags.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pr-2 no-scrollbar">
              {p.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          )}

          {/* metrics */}
          {p?.metrics && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(p.metrics).map(([k, v]) => (
                <Chip key={k}>
                  <span className="text-subtext mr-1">{k}:</span>
                  <span>{v}</span>
                </Chip>
              ))}
            </div>
          )}

          {/* cards */}
          {hasDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {p?.modelCard && (
                <Block title="Model Card">
                  <Row label="Architecture" value={p.modelCard.architecture} />
                  <Row label="Params" value={p.modelCard.params} />
                  <Row label="Size" value={p.modelCard.size} />
                  <Row label="Framework" value={p.modelCard.framework} />
                  <Row label="Use" value={p.modelCard.intendedUse} />
                  <Row label="Limitations" value={p.modelCard.limitations} />
                  <Row label="License" value={p.modelCard.license} />
                  {p.modelCard.description && (
                    <div className="text-sm leading-relaxed pt-2 border-t border-base">
                      {p.modelCard.description}
                    </div>
                  )}
                </Block>
              )}
              {p?.dataCard && (
                <Block title="Data Card">
                  <Row label="Source" value={p.dataCard.source} />
                  <Row label="Records" value={p.dataCard.records} />
                  <Row label="Splits" value={p.dataCard.splits} />
                  <Row label="Features" value={p.dataCard.features} />
                  <Row label="Preprocessing" value={p.dataCard.preprocessing} />
                  <Row label="Risks" value={p.dataCard.risks} />
                  <Row label="License" value={p.dataCard.license} />
                  {p.dataCard.description && (
                    <div className="text-sm leading-relaxed pt-2 border-t border-base">
                      {p.dataCard.description}
                    </div>
                  )}
                </Block>
              )}
            </div>
          ) : (
            <p className="text-sm text-subtext">No details yet.</p>
          )}
        </div>

        {/* footer */}
        <div className="px-5 py-4 border-t border-base bg-surface-95 flex items-center justify-end gap-2">
          {p?.github && (
            <a href={p.github} target="_blank" rel="noreferrer">
              <Btn variant="ghost">GitHub</Btn>
            </a>
          )}
          <Btn onClick={onClose}>Close</Btn>
        </div>
      </div>
    </div>

    
  );


}
