import { useState } from 'react';
import ProjectDetailsModal from './ProjectDetailsModal.jsx';

function fmtDate(d){ try { return new Date(d).toLocaleDateString(); } catch { return ''; } }

export default function ProjectCard({ p }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="card overflow-hidden relative">
        {/* Cover with gradient overlay */}
        <div className="relative">
          {p.cover && (
            <img src={p.cover} alt={p.title} className="w-full h-44 object-cover" loading="lazy" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)]/95 via-[var(--bg-card)]/10 to-transparent" />
          {p.featured && (
            <span className="absolute top-3 left-3 badge" style={{background:'var(--accent)', color:'#fff'}}>Featured</span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold">{p.title}</h3>
          {p.subtitle && <p className="text-subtext text-sm mt-1">{p.subtitle}</p>}

          {/* Quick facts row */}
          <div className="mt-3 flex flex-wrap gap-2">
            {p.metrics?.dataset && <span className="badge">{p.metrics.dataset}</span>}
            {p.metrics?.score && <span className="badge">{p.metrics.score}</span>}
            {p.lastUpdated && <span className="badge">Updated {fmtDate(p.lastUpdated)}</span>}
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {p.tags?.map(t => <span key={t} className="badge">{t}</span>)}
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap gap-3">
            {p.github && (
              <a className="btn btn-ghost" href={p.github} target="_blank" rel="noreferrer">GitHub</a>
            )}

            {(p.modelCard || p.dataCard) && (
              <button className="btn btn-primary" onClick={() => setOpen(true)}>
                Details
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Modal keeps the card compact */}
      <ProjectDetailsModal open={open} onClose={() => setOpen(false)} p={p} />
    </>
  );
}
