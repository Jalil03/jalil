import { useEffect } from 'react';

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="text-sm">
      <span className="text-subtext">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div className="p-4 rounded-xl bg-elevated border border-base">
      <div className="font-semibold mb-2">{title}</div>
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

export default function ProjectDetailsModal({ open, onClose, p }) {
  useEffect(() => {
    function onEsc(e){ if(e.key === 'Escape') onClose?.(); }
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-base text-text border border-base shadow-xl"
           onClick={(e)=>e.stopPropagation()}>
        <div className="p-4 border-b border-base flex items-center justify-between">
          <div className="font-semibold">{p.title}</div>
          <button className="btn btn-ghost" onClick={onClose}>Close ✕</button>
        </div>

        <div className="p-4 grid md:grid-cols-2 gap-4">
          {p.modelCard && (
            <Block title="Model Card">
              <Row label="Architecture" value={p.modelCard.architecture} />
              <Row label="Params" value={p.modelCard.params} />
              <Row label="Size" value={p.modelCard.size} />
              <Row label="Framework" value={p.modelCard.framework} />
              <Row label="Use" value={p.modelCard.intendedUse} />
              <Row label="Limitations" value={p.modelCard.limitations} />
              <Row label="License" value={p.modelCard.license} />
            </Block>
          )}
          {p.dataCard && (
            <Block title="Data Card">
              <Row label="Source" value={p.dataCard.source} />
              <Row label="Records" value={p.dataCard.records} />
              <Row label="Splits" value={p.dataCard.splits} />
              <Row label="Features" value={p.dataCard.features} />
              <Row label="Preprocessing" value={p.dataCard.preprocessing} />
              <Row label="Risks" value={p.dataCard.risks} />
              <Row label="License" value={p.dataCard.license} />
            </Block>
          )}
          {!p.modelCard && !p.dataCard && (
            <p className="text-subtext">No details yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
