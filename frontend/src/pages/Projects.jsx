import { useEffect, useState } from 'react';
import { fetchProjects } from '../api';
import ProjectCard from '../components/ProjectCard.jsx';
import Filters from '../components/Filters.jsx';

function SkeletonCard() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm dark:bg-black/20">
      <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-white/10" />
      <div className="mt-4 h-4 w-3/5 animate-pulse rounded bg-white/10" />
      <div className="mt-2 h-3 w-2/5 animate-pulse rounded bg-white/10" />
      <div className="mt-6 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-full bg-white/10" />
        <div className="h-6 w-12 animate-pulse rounded-full bg-white/10" />
      </div>
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm dark:bg-black/20">
      <div className="i-lucide-folder-open h-10 w-10 opacity-70" aria-hidden />
      <h3 className="text-lg font-semibold">No projects match your filters</h3>
      <p className="text-sm text-muted-foreground">Try removing a tag or changing the sort to see more work.</p>
      <button onClick={onReset} className="mt-2 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400/50">
        Reset filters
      </button>
    </div>
  );
}

export default function Projects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tag, setTag] = useState('All');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetchProjects({ tag, sort })
      .then((d) => {
        if (!active) return;
        setItems(Array.isArray(d) ? d : []);
      })
      .catch(() => {
        if (!active) return;
        setError('Failed to load projects.');
        setItems([]);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [tag, sort]);

  const resetFilters = () => {
    setTag('All');
    setSort('featured');
  };

  return (
    <section className="relative mx-auto max-w-[1200px] px-6 py-10 md:px-12">
      {/* Section header */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Selected machine learning & data systems work
          </p>
        </div>
        {/* Live count & sort badge */}
        <div className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur sm:self-auto">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {items.length}
          </span>
          <span className="hidden sm:inline">items</span>
          <span className="mx-1 h-3 w-px bg-white/10" />
          <span className="capitalize">sort: {sort}</span>
        </div>
      </div>

     {/* Filters — non-sticky, normal flow */}
    <div className="mb-6">
      <Filters tag={tag} setTag={setTag} sort={sort} setSort={setSort} />
    </div>


      {/* Content */}
      {error ? (
        <div className="mt-10 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="pt-10">
          <EmptyState onReset={resetFilters} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, idx) => (
            <div
              key={p.slug}
              className="opacity-0 [animation:fadeInUp_0.5s_ease_forwards]"
              style={{ animationDelay: `${Math.min(idx, 6) * 60}ms` }}
            >
              <ProjectCard p={p} />
            </div>
          ))}
        </div>
      )}

      {/* Tiny CSS animation (no extra deps) */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px)} to { opacity: 1; transform: translateY(0)} }
      `}</style>

      
    </section>
  );
}
