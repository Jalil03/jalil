import { useEffect, useRef, useState } from 'react';
import { fetchProjects } from '../api';
import MiniProjectCard from './MiniProjectCard.jsx';

export default function FeaturedProjects({ onSeeAll }) {
  const [items, setItems] = useState([]);
  const scrollerRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    fetchProjects({ sort: 'featured' }).then((d) => {
      const list = (d || []).slice(0, 3);
      setItems(list);
      requestAnimationFrame(updateEdges);
    });
  }, []);

  const updateEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 2);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 2);
  };

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const slide = el.querySelector('article');
    const delta = slide?.offsetWidth || Math.round(window.innerWidth * 0.85);
    el.scrollBy({ left: dir * delta, behavior: 'smooth' });
    setTimeout(updateEdges, 220);
  };

  return (
    // extra spacing OUTSIDE the section so it doesn't crowd neighbors
    <section className="bg-base my-12 md:my-16 lg:my-20">
      {/* extra spacing INSIDE the section */}
      <div className="container pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-20 lg:pb-20">
        {/* consistent vertical rhythm between header and list */}
        <div className="space-y-6 md:space-y-8">
          {/* header row */}
          <div className="flex items-end justify-between">
            <div className="space-y-1.5 md:space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">Featured work</h2>
              <p className="text-subtext text-sm md:text-base">
                A few highlights—see Projects for more.
              </p>
            </div>
            <button className="btn btn-primary md:mt-1.5" onClick={onSeeAll}>
              See all
            </button>
          </div>

          {/* Mobile scroller with arrows & fades */}
          <div className="relative md:hidden -mx-4">
            {/* Left gradient fade */}
            {!atStart && (
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--bg-base)] to-transparent z-10" />
            )}
            {/* Right gradient fade */}
            {!atEnd && (
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--bg-base)] to-transparent z-10" />
            )}

            {/* Left arrow */}
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollByCard(-1)}
              className={[
                'absolute top-1/2 -translate-y-1/2 left-1 z-20',
                'rounded-full border border-base shadow-md p-2',
                'bg-[color-mix(in_srgb,var(--bg-base)_85%,transparent)] backdrop-blur-md',
                atStart ? 'opacity-0 pointer-events-none' : 'opacity-100',
                'transition',
              ].join(' ')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 19L8 12l7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Right arrow */}
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByCard(1)}
              className={[
                'absolute top-1/2 -translate-y-1/2 right-1 z-20',
                'rounded-full border border-base shadow-md p-2',
                'bg-[color-mix(in_srgb,var(--bg-base)_85%,transparent)] backdrop-blur-md',
                atEnd ? 'opacity-0 pointer-events-none' : 'opacity-100',
                'transition',
              ].join(' ')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              ref={scrollerRef}
              onScroll={updateEdges}
              className="flex gap-4 px-4 overflow-x-auto snap-x snap-mandatory no-scrollbar"
            >
              {items.map((p) => (
                <MiniProjectCard
                  key={p.slug || p.title}
                  p={p}
                  className="min-w-[85%] snap-start"
                />
              ))}
            </div>
          </div>

          {/* md+ grid layout */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <MiniProjectCard key={p.slug || p.title} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
