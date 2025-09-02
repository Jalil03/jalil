import { useState } from "react";

export default function About() {
  // mouse-follow spotlight (subtle)
  const [spot, setSpot] = useState({ x: "60%", y: "30%" });
  function moveSpot(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setSpot({ x: `${x}%`, y: `${y}%` });
  }

  return (
    <section id="about" className="max-w-[980px] mx-auto px-6 md:px-10 lg:px-12">
      {/* PANEL (clips background, keeps layout compact) */}
      <div
        onMouseMove={moveSpot}
        className="
          relative overflow-hidden rounded-3xl border border-base
          bg-[color-mix(in_srgb,var(--bg-card)_78%,transparent)]
          mt-8 md:mt-10
        "
      >
        {/* background layers */}
        <div aria-hidden className="abs-layer grid-lines" />
        <div aria-hidden className="abs-layer aurora" />
        <div aria-hidden className="abs-layer orb orb-a" />
        <div aria-hidden className="abs-layer orb orb-b" />
        <div
          aria-hidden
          className="abs-layer spot"
          style={{ "--sx": spot.x, "--sy": spot.y }}
        />

        {/* CONTENT */}
        <div className="relative p-8 md:p-10">
          <h1 className="inline-flex items-center gap-3 text-[40px] md:text-5xl font-extrabold tracking-tight">
            <span className="title-grad">About</span>
            <span className="twinkle" aria-hidden>✦</span>
          </h1>

          <p className="mt-2.5 text-subtext max-w-2xl leading-relaxed">
            I’m <span className="font-semibold">BOUZINE Abdeljalil</span>, a Moroccan ML engineer (Master AIDC). I design
            and ship compact, reliable ML services—most often with{" "}
            <span className="font-medium">PyTorch</span>, FastAPI backends, and clear user-facing
            dashboards. I care about measurable impact, clean interfaces, and code that other people
            can maintain.
          </p>

          {/* quick chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["Computer Vision", "Time-series", "PyTorch", "FastAPI", "Kafka → Neo4j"].map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>

          {/* what I do */}
          <ul className="mt-6 space-y-2">
            <li className="fun-bullet">
              Scope → prototype → evaluate → <span className="font-medium">deploy a tidy service</span>.
            </li>
            <li className="fun-bullet">
              Build <span className="font-medium">honest dashboards</span> that surface accuracy, latency, and cost.
            </li>
          </ul>

          {/* small “talk” paragraph */}
          <p className="mt-4 text-subtext max-w-2xl">
            If you’ve got a dataset and a rough idea, I can help transform it into a focused demo—
            then harden it into a small service with tracking and simple DevOps. I prefer calm
            velocity over hype and keep stakeholders in the loop with short milestones.
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              className="btn btn-primary w-full sm:w-auto hover:-translate-y-[1px] hover:shadow-lg transition"
              href="mailto:abdobouzine2003@gmail.com?subject=Hi%20JL%20—%20Project%20idea"
            >
              Get in touch
            </a>
            <a className="btn btn-ghost w-full sm:w-auto" href="/cv.pdf" target="_blank" rel="noreferrer">
              Resume
            </a>
          </div>
        </div>

        {/* bottom divider */}
        <div className="h-8 md:h-10 wave-mask" />
      </div>

      {/* tighten space below the panel */}
      <div className="-mt-3 md:-mt-4" />

      {/* styles */}
      <style>{`
        .abs-layer{ position:absolute; inset:0; pointer-events:none; }
        .title-grad{
          background: linear-gradient(90deg, var(--accent), var(--accent-hi));
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .twinkle{
          color: var(--accent); font-size: 20px;
          animation: twinkle 2.2s linear infinite;
          filter: drop-shadow(0 0 6px color-mix(in srgb,var(--accent) 45%, transparent));
        }
        @keyframes twinkle { 0%,100%{ transform: rotate(0) } 50%{ transform: rotate(18deg) } }

        .chip{
          padding: 6px 10px; border-radius: 9999px; font-size: 12px;
          border: 1px solid var(--base);
          background: color-mix(in srgb, var(--bg-elevated) 82%, transparent);
          backdrop-filter: blur(4px);
        }
        .fun-bullet{
          position: relative; padding-left: 20px; color: var(--subtext);
        }
        .fun-bullet::before{
          content:""; position:absolute; left:0; top:0.68em; width:10px; height:10px; border-radius:9999px;
          background: var(--accent);
          box-shadow: 0 0 0 0 color-mix(in srgb,var(--accent) 45%, transparent);
          animation: pulse 2.2s infinite;
        }
        @keyframes pulse { 0%{ box-shadow: 0 0 0 0 rgba(0,0,0,0) } 70%{ box-shadow: 0 0 0 12px rgba(0,0,0,0) } 100%{ box-shadow: 0 0 0 0 rgba(0,0,0,0) } }

        .grid-lines{
          opacity:.12;
          background:
            linear-gradient(180deg, transparent, color-mix(in srgb, var(--bg-card) 55%, transparent), transparent),
            repeating-linear-gradient(0deg, transparent 0 24px, var(--grid) 24px 25px);
        }
        .spot{
          opacity:.38;
          background: radial-gradient(220px 180px at var(--sx) var(--sy),
            color-mix(in srgb,var(--accent) 22%, transparent), transparent 60%);
        }
        .aurora{
          opacity:.35; filter: blur(28px);
          background:
            conic-gradient(from 0deg at 70% 30%,
              color-mix(in srgb, var(--accent-hi) 38%, transparent),
              transparent 40%,
              color-mix(in srgb, var(--accent) 32%, transparent) 70%,
              transparent 100%);
          animation: sweep 16s linear infinite;
        }
        @keyframes sweep { to { transform: rotate(360deg) } }
        .orb{ filter: blur(42px); opacity:.26; }
        .orb-a{ width:240px; height:240px; left:-120px; bottom:-70px;
                background: radial-gradient(closest-side, var(--accent-hi), transparent);
                animation: floatA 9s ease-in-out infinite; }
        .orb-b{ width:200px; height:200px; right:-90px; top:-60px;
                background: radial-gradient(closest-side, var(--accent), transparent);
                animation: floatB 11s ease-in-out infinite; }
        @keyframes floatA { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-14px) } }
        @keyframes floatB { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(12px) } }

        .wave-mask{
          background: linear-gradient(180deg, transparent, color-mix(in srgb,var(--accent) 12%, transparent));
          -webkit-mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 120 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 Q10 0 20 6 T40 6 T60 6 T80 6 T100 6 T120 6 V16 H0Z' fill='white'/%3E%3C/svg%3E") repeat-x 0 100% / 120px 16px;
                  mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 120 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6 Q10 0 20 6 T40 6 T60 6 T80 6 T100 6 T120 6 V16 H0Z' fill='white'/%3E%3C/svg%3E") repeat-x 0 100% / 120px 16px;
        }

        @media (prefers-reduced-motion: reduce){
          .twinkle, .aurora, .orb-a, .orb-b { animation: none !important; }
          .spot{ display:none; }
        }
      `}</style>
    </section>
  );
}
