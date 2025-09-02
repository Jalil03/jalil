import { useState } from 'react';
import ProjectDetailsModal from './ProjectDetailsModal.jsx';

function fmtDate(d) {
  try { return new Date(d).toLocaleDateString(); } catch { return ''; }
}

function initialsFrom(title = '') {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('') || 'PR';
}

export default function ProjectCard({ p }) {
  const [open, setOpen] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);
  const showImg = !!p.cover && !imgBroken;

  return (
    <>
      <article className="card relative isolate overflow-hidden rounded-2xl">
        {/* MEDIA */}
        <div className="relative overflow-hidden rounded-t-2xl">
          {showImg ? (
            <img
              src={p.cover}
              alt={p.title}
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              onError={() => setImgBroken(true)}
            />
          ) : (
            <div className="w-full aspect-[4/3] relative grid place-items-center bg-white/5 dark:bg-black/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10/20 to-transparent" />
              <div className="flex items-center gap-3 opacity-80">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/10 dark:bg-black/30 text-sm font-semibold">
                  {initialsFrom(p.title)}
                </div>
                <span className="hidden sm:block text-xs text-muted-foreground">No cover image</span>
              </div>
            </div>
          )}

          {/* Overlay + badge */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-card)]/95 via-[var(--bg-card)]/10 to-transparent" />
          {p.featured && (
            <span
              className="absolute top-3 left-3 badge"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Featured
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="relative z-20 p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-semibold leading-snug line-clamp-2 break-words">
            {p.title}
          </h3>

          {p.subtitle && (
            <p className="text-subtext text-sm sm:text-[15px] mt-1 line-clamp-2 break-words">
              {p.subtitle}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2 text-[11px] sm:text-xs">
            {p.metrics?.dataset && <span className="badge">{p.metrics.dataset}</span>}
            {p.metrics?.score && <span className="badge">{p.metrics.score}</span>}
            {p.lastUpdated && <span className="badge">Updated {fmtDate(p.lastUpdated)}</span>}
          </div>

          {Array.isArray(p.tags) && p.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] sm:text-xs">
              {p.tags.map((t) => (
                <span key={t} className="badge">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            {p.github && (
              <a
                className="btn btn-ghost w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                href={p.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            )}

            {(p.modelCard || p.dataCard) && (
              <button
                className="btn btn-primary w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                onClick={() => setOpen(true)}
              >
                Details
              </button>
            )}
          </div>
        </div>
      </article>

      <ProjectDetailsModal open={open} onClose={() => setOpen(false)} p={p} />
    </>
  );
}
