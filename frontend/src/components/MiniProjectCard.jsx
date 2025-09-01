function FmtDate({ d }) {
  try {
    const s = d ? new Date(d).toLocaleDateString() : '';
    return s ? <span className="badge whitespace-nowrap">Updated {s}</span> : null;
  } catch {
    return null;
  }
}

export default function MiniProjectCard({ p, className = '' }) {
  return (
    <article
      className={[
        // Mobile: behaves like a slide
        'bg-card border border-base rounded-xl p-3 flex gap-3 items-start',
        'flex-shrink-0 mr-4 [scroll-snap-align:start]',
        // Keep a consistent minimum height so slides look equal
        'min-h-[150px]',
        // md+: revert back for grid layouts
        'md:flex-shrink md:mr-0 md:[scroll-snap-align:unset]',
        className,
      ].join(' ')}
    >
      {p.cover && (
        <img
          src={p.cover}
          alt={p.title}
          className="w-28 h-20 object-cover rounded-md border border-base flex-shrink-0"
          loading="lazy"
        />
      )}

      <div className="min-w-0 flex-1">
        {/* keep title single line so heights don't vary */}
        <h3 className="font-semibold leading-tight truncate">{p.title}</h3>

        {/* clamp subtitle to 2 lines to avoid taller slides */}
        {p.subtitle && (
          <p className="text-subtext text-sm line-clamp-2 mt-1">{p.subtitle}</p>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {p.metrics?.score && (
            <span className="badge whitespace-nowrap">{p.metrics.score}</span>
          )}
          <FmtDate d={p.lastUpdated} />
        </div>

        <div className="mt-2 flex gap-2">
          {p.github && (
            <a
              className="btn btn-ghost"
              href={p.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
