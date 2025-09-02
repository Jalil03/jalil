import { useState, useRef, useEffect } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const toastTimer = useRef(null);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "What should I call you?";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Use a valid email.";
    if (form.message.trim().length < 10) next.message = "Tell me a bit more (≥ 10 chars).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} <${form.email}>`);
      window.location.href = `mailto:abdobouzine2003@gmail.com?subject=${subject}&body=${body}`;
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      toastTimer.current = setTimeout(() => setStatus("idle"), 3500);
    } catch {
      setStatus("error");
      toastTimer.current = setTimeout(() => setStatus("idle"), 3500);
    }
  }

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  return (
    <section id="contact" className="max-w-[1024px] mx-auto px-6 md:px-10 lg:px-12">
      <div className="relative overflow-hidden rounded-3xl border border-base mt-8 md:mt-10 bg-panel">
        {/* Subtle background */}
        <div aria-hidden className="abs dots" />
        <div aria-hidden className="abs stripes" />

        {/* Thin accent bar (no white tape / no bubble) */}
        <div aria-hidden className="accent-bar" />

        <div className="relative p-6 sm:p-7 md:p-10">
          {/* header */}
          <h1 className="title">Contact</h1>
          <p className="mt-2 text-subtext max-w-2xl">
            Got a dataset, an idea, or a stubborn bottleneck? Drop a note—short is fine. I reply quickly.
          </p>

          {/* layout */}
          <div className="mt-7 grid md:grid-cols-5 gap-6">
            {/* left: info card */}
            <aside className="md:col-span-2 space-y-4 min-w-0">
              <div className="card">
                <div className="text-sm text-subtext">Email</div>
                <a
                  className="link-row"
                  href="mailto:abdobouzine2003@gmail.com?subject=Hi%20JL"
                >
                  <span className="truncate-wrap">abdobouzine2003@gmail.com</span>
                  <span className="arr">→</span>
                </a>
              </div>

              <div className="card">
                <div className="text-sm text-subtext">Elsewhere</div>
                <div className="links">
                  <a href="https://github.com/Jalil03" target="_blank" rel="noreferrer">GitHub</a>
                  <a href="https://www.linkedin.com/in/abdeljalil-bouzine/" target="_blank" rel="noreferrer">LinkedIn</a>
                  <a href="/cv.pdf" target="_blank" rel="noreferrer">Resume</a>
                </div>
              </div>

              <div className="card">
                <div className="text-sm text-subtext">Nice topics</div>
                <div className="chips">
                  {["Vision", "Time-series", "FastAPI", "Kafka → Neo4j"].map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
                <p className="tiny mt-2">One sentence is plenty—links welcome.</p>
              </div>
            </aside>

            {/* right: form */}
            <form onSubmit={onSubmit} className="md:col-span-3 space-y-4 min-w-0">
              <div className="field">
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder=" "
                  className={`control ${errors.name ? "err" : ""}`}
                  autoComplete="name"
                />
                <label htmlFor="name">Name</label>
                {errors.name && <p className="msg">{errors.name}</p>}
              </div>

              <div className="field">
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder=" "
                  className={`control ${errors.email ? "err" : ""}`}
                  autoComplete="email"
                />
                <label htmlFor="email">Email</label>
                {errors.email && <p className="msg">{errors.email}</p>}
              </div>

              <div className="field">
                <textarea
                  id="message"
                  rows={5}
                  maxLength={2000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder=" "
                  className={`control textarea ${errors.message ? "err" : ""}`}
                />
                <label htmlFor="message">Message</label>
                <div className="count">{form.message.length}/2000</div>
                {errors.message && <p className="msg">{errors.message}</p>}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="send"
                >
                  <span className="plane" aria-hidden></span>
                  <span>{status === "sending" ? "Sending…" : status === "sent" ? "Sent!" : "Send"}</span>
                </button>
                {status === "error" && (
                  <p className="mt-2 text-xs text-red-400">
                    Something went wrong. Email me directly at <span className="underline">abdobouzine2003@gmail.com</span>.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* toast */}
        {status === "sent" && (
          <div className="toast">Thanks! I’ll get back to you shortly.</div>
        )}
      </div>

      {/* pull footer closer */}
      <div className="-mt-3 md:-mt-4" />

      <style>{`
        .bg-panel{
          background:
            radial-gradient(1200px 400px at 80% -10%, color-mix(in srgb,var(--accent) 18%, transparent), transparent),
            color-mix(in srgb, var(--bg-card) 82%, transparent);
        }
        .abs{ position:absolute; inset:0; pointer-events:none; }
        .dots{
          opacity:.10;
          background:
            radial-gradient(1px 1px at 1px 1px, var(--grid), transparent) 0 0/18px 18px;
        }
        .stripes{
          opacity:.08;
          background: repeating-linear-gradient(135deg, var(--grid) 0 2px, transparent 2px 12px);
          mix-blend-mode: lighten;
        }

        /* Thin top bar */
        .accent-bar{
          position:absolute; inset:0 0 auto 0; height:4px; z-index:2;
          background: linear-gradient(90deg, var(--accent), var(--accent-hi));
          box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 40%, transparent);
        }

        /* Header (simpler, no weird stroke) */
        .title{
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.02em;
          font-size: clamp(28px, 6vw, 40px);
          background: linear-gradient(90deg, var(--text), var(--text));
          -webkit-background-clip: text;
          color: transparent;
          text-shadow: 0 0 0 var(--text);
        }

        /* cards & links */
        .card{
          border: 1px solid var(--base);
          background: color-mix(in srgb, var(--bg-elevated) 82%, transparent);
          backdrop-filter: blur(4px);
          border-radius: 16px;
          padding: 14px 16px;
          min-width: 0; /* prevent overflow in grid */
        }
        .links{
          display:flex; flex-wrap:wrap; gap:10px;
        }
        .links a{
          border:1px solid var(--base); border-radius:9999px; padding:6px 10px; font-size:12px;
          background: color-mix(in srgb, var(--bg-elevated) 84%, transparent);
        }
        .chips{ display:flex; flex-wrap:wrap; gap:8px; }
        .chip{
          border:1px solid var(--base); border-radius:9999px; padding:6px 10px; font-size:12px;
          background: color-mix(in srgb, var(--bg-elevated) 88%, transparent);
        }

        /* single-row link that wraps nicely */
        .link-row{
          display:flex; align-items:center; gap:10px;
          border:1px solid var(--base); border-radius:12px; padding:8px 10px;
          background: color-mix(in srgb, var(--bg-elevated) 86%, transparent);
          transition: transform .15s ease;
          min-width:0;
        }
        .link-row:hover{ transform: translateY(-1px); }
        .truncate-wrap{
          min-width:0; flex:1 1 auto;
          overflow-wrap:anywhere; /* allow email to break */
          word-break:break-word;
        }
        .arr{ font-weight:700; color: var(--accent); flex:0 0 auto; }

        /* floating labels */
        .field{ position:relative; min-width:0; }
        .control{
          width:100%; border-radius:14px; border:1px solid var(--base);
          background: color-mix(in srgb, var(--bg-elevated) 88%, transparent);
          padding: 22px 16px 12px 16px; outline:none;
          transition: box-shadow .15s ease, border-color .15s ease, background .15s ease;
        }
        .control.textarea{ min-height:140px; resize:vertical; }
        .control:focus{
          border-color: color-mix(in srgb, var(--accent) 35%, var(--base));
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent);
          background: color-mix(in srgb, var(--bg-elevated) 92%, transparent);
        }
        .control.err{ border-color: rgba(244,63,94,.55); box-shadow: 0 0 0 2px rgba(244,63,94,.2); }
        .field label{
          position:absolute; left:14px; top:12px; font-size:12px; color: var(--subtext);
          padding:0 6px; background: color-mix(in srgb, var(--bg-elevated) 88%, transparent);
          transform-origin:left top; transition: transform .15s ease, color .15s ease, top .15s ease;
        }
        .control:not(:placeholder-shown) ~ label,
        .control:focus ~ label{
          transform: translateY(-12px) scale(.9);
          color: color-mix(in srgb, var(--accent) 40%, var(--subtext));
        }
        .msg{ margin-top:4px; font-size:11px; color:#f87171; }
        .count{ position:absolute; right:10px; bottom:10px; font-size:11px; color: var(--subtext); }

        /* send button */
        .send{
          display:inline-flex; align-items:center; gap:10px; font-weight:700;
          border:1px solid var(--base); border-radius:12px; padding:10px 14px;
          background: radial-gradient(120% 120% at 0% 0%, color-mix(in srgb,var(--accent) 18%, transparent), transparent 60%),
                      color-mix(in srgb, var(--bg-card) 88%, transparent);
          box-shadow: 0 8px 18px -12px rgba(0,0,0,.55);
          transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
        }
        .send:hover{ transform: translateY(-1px); box-shadow: 0 12px 24px -12px rgba(0,0,0,.55); }
        .send:disabled{ opacity:.8; cursor:not-allowed; }
        .plane{ transform: translateY(1px); }
        .send:hover .plane{ transform: translateY(-1px) translateX(2px); }

        /* toast */
        .toast{
          position:absolute; left:50%; bottom:16px; transform:translateX(-50%);
          background: color-mix(in srgb, var(--bg-elevated) 92%, transparent);
          border:1px solid var(--base); border-radius:12px; padding:10px 14px;
          box-shadow: 0 10px 30px -12px rgba(0,0,0,.5);
          animation: pop .25s ease;
        }
        @keyframes pop{ from{ transform: translateX(-50%) translateY(6px); opacity:.0 } to{ transform: translateX(-50%) translateY(0); opacity:1 } }

        /* Small-screen polish */
        @media (max-width: 420px){
          .links a, .chip { font-size:11px; padding:5px 9px; }
          .control{ padding:20px 14px 10px 14px; }
        }
      `}</style>
    </section>
  );
}
