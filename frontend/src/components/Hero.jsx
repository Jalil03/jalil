// src/components/Hero.jsx
import Ticker from "../components/Ticker.jsx";
import { useEffect, useState } from "react";

/** Simple looping typewriter for one phrase (type → hold → delete → repeat) */
function TypeLoop({
  text = "Machine Learning Engineer",
  speed = 70,       // ms per typed character
  backSpeed = 45,   // ms per deleted character
  hold = 1000,      // pause at full text
  restart = 600,    // pause when empty before typing again
  startDelay = 200, // initial delay
}) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1); // 1 = typing, -1 = deleting

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  useEffect(() => {
    if (reduce) {
      setI(text.length);
      return;
    }

    let nextI = i;
    let nextDir = dir;
    let delay = speed;

    if (dir === 1) {
      if (i < text.length) {
        nextI = i + 1;
        delay = speed;
      } else {
        // at full length — hold, then switch to deleting
        nextI = i;
        nextDir = -1;
        delay = hold;
      }
    } else {
      if (i > 0) {
        nextI = i - 1;
        delay = backSpeed;
      } else {
        // empty — pause, then switch to typing
        nextI = i;
        nextDir = 1;
        delay = restart;
      }
    }

    const t = setTimeout(() => {
      setI(nextI);
      if (nextDir !== dir) setDir(nextDir);
    }, i === 0 && dir === 1 ? startDelay : delay);

    return () => clearTimeout(t);
  }, [i, dir, text.length, speed, backSpeed, hold, restart, startDelay, reduce]);

  const shown = reduce ? text : text.slice(0, i);

  return (
    <span>
      {/* gradient only on the typed phrase */}
      <span className="text-gradient">{shown}</span>
      {!reduce && <span className="typed-caret" aria-hidden="true" />}
    </span>
  );
}

export default function Hero({ onViewProjects }) {
  return (
    <section className="text-text">
      {/* A little extra offset under the sticky header (~56px) so it never feels stuck */}
      <div
        className="
          container px-4 sm:px-6 lg:px-8
          pt-[calc(56px+1rem)]
          sm:pt-[calc(56px+1.25rem)]
          md:pt-[calc(56px+1.75rem)]
          lg:pt-[calc(56px+2rem)]
          pb-12 md:pb-20 lg:pb-24
        "
      >
        <div className="grid md:grid-cols-2 items-center gap-y-12 gap-x-8 md:gap-x-14 lg:gap-x-24">
          {/* LEFT */}
          <div className="flex flex-col gap-6 md:gap-9 lg:gap-10 md:pr-10 xl:pr-20 max-w-[46rem]">
            {/* Headline: static intro + looping typewriter */}
            <h1 className="font-extrabold tracking-tight leading-[1.15] text-3xl sm:text-4xl md:text-6xl">
              <span className="block reveal-line" style={{ animationDelay: "120ms" }}>
                I am a{" "}
                <TypeLoop
                  text="Machine Learning Engineer"
                  speed={65}
                  backSpeed={45}
                  hold={1100}
                  restart={650}
                  startDelay={200}
                />
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-subtext max-w-prose text-[15px] sm:text-base reveal-line"
              style={{ animationDelay: "260ms" }}
            >
              From PyTorch training to MLOps, Kafka streaming, and clean MERN dashboards.
              Explore selected projects with metrics, diagrams, and case studies.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <button
                className="btn btn-primary btn-lg w-full sm:w-auto transition-transform duration-150 hover:-translate-y-[1px] active:translate-y-0"
                style={{ animationDelay: "320ms" }}
                onClick={onViewProjects}
              >
                View Projects
              </button>
              <a
                className="btn btn-ghost btn-lg w-full sm:w-auto transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--bg-elevated)_85%,transparent)]"
                style={{ animationDelay: "360ms" }}
                href="/cv.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Download CV
              </a>
            </div>

            {/* Mobile-only ticker & stats */}
            <Ticker
              className="mt-6 md:mt-8 md:hidden"
              speed={90}
              gap={14}
              items={[
                "10+ repos",
                "3 production demos",
                "MERN • PyTorch • Spark",
                "FastAPI • Kafka",
                "React • Vite • Docker",
              ]}
            />
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {[
                ["Best Acc.", "95.4%", "CViT digits"],
                ["IoT F1", "0.87", "Rain predictor"],
                ["Prod. demos", "3", "Live & maintained"],
                ["Years", "2+", "ML/Full-stack"],
              ].map(([k, v, s], i) => (
                <div key={k} className="card p-3 animate-pop-in" style={{ animationDelay: `${420 + i * 60}ms` }}>
                  <div className="text-subtext text-xs">{k}</div>
                  <div className="text-lg font-semibold">{v}</div>
                  <div className="text-subtext text-xs">{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT visual */}
          <div className="hidden md:flex justify-end md:pl-4 lg:pl-8">
            <div className="w-full md:max-w-[380px] lg:max-w-[440px] xl:max-w-[500px]">
              <div className="hero-blob relative overflow-hidden rounded-2xl border border-base shadow-xl animate-float-slow">
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, var(--bg-card), var(--bg-elevated))" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      radial-gradient(60% 45% at 80% 20%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 65%),
                      radial-gradient(60% 45% at 20% 80%, color-mix(in srgb, var(--accent-hi) 28%, transparent), transparent 65%)
                    `,
                  }}
                />
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent 0 24px, var(--grid) 24px 26px)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal local styles */}
      <style>{`
        /* One-time reveal for headline/paragraph */
        .reveal-line{
          opacity:0;
          transform: translateY(8px);
          animation: fadeUpOnce .45s cubic-bezier(.2,.7,.2,1) forwards;
        }
        @keyframes fadeUpOnce{ to { opacity:1; transform: translateY(0) } }

        /* Caret for the typewriter (accent colored so it shows on gradient text) */
        .typed-caret{
          display:inline-block;
          width:2px;
          height:1em;
          margin-left:4px;
          background: var(--accent);
          animation: blink 1s step-end infinite;
          vertical-align: -2px;
        }
        @keyframes blink { 0%,40%{opacity:1} 50%,100%{opacity:0} }

        /* Right visual idle float */
        @keyframes floatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; will-change: transform; }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce){
          .reveal-line { animation: none; opacity:1; transform:none; }
          .typed-caret { display: none; }
          .animate-float-slow { animation: none; }
        }
      `}</style>
    </section>
  );
}
