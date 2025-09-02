// src/components/ChatWidget.jsx
import { useEffect, useMemo, useRef, useState } from "react";

/* ----------------------- small utils ----------------------- */
function formatContent(text) {
  const s = typeof text === "string" ? text : String(text ?? "");
  const hasAnchor = /<a\s/i.test(s);
  const linkified = hasAnchor
    ? s
    : s.replace(
        /(https?:\/\/[^\s)]+)|(www\.[^\s)]+)/gi,
        (m) =>
          `<a href="${m.startsWith("http") ? m : "https://${m}"}" target="_blank" rel="noreferrer" class="underline">${m}</a>`
      );
  return linkified.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-white/10">$1</code>');
}

function useAutogrow(ref, value) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);
}

const CV_HREF = `${import.meta.env.BASE_URL || "/"}cv.pdf`;

function getReply(userText) {
  const t = userText.toLowerCase().trim();

  // NEW: "who are you" / "who r u"
  if (/(^|\b)who\s*(are|r)\s*(you|u)\b|\bwho\s*r\s*u\b/i.test(t)) {
    return `I’m an assistant built into this site to help you quickly find what you need — links to my CV, GitHub, LinkedIn, and highlights of my ML & data systems projects. Ask me things like “Where is your CV?”, “Show me ML work”, or “How can I contact you?”.`;
  }

  if (/(cv|resume|résumé)/i.test(t)) {
    return `Here’s my CV: <a href="${CV_HREF}" target="_blank" rel="noreferrer" class="underline">cv.pdf</a>`;
  }
  if (/(contact|email|reach|talk|message)/i.test(t)) {
    return `You can email me at <a href="mailto:abdobouzine2003@gmail.com" class="underline">abdobouzine2003@gmail.com</a> or use the Contact section on the site. I usually reply quickly.`;
  }
  if (/linkedin|linkdin/i.test(t)) {
    return `My LinkedIn: <a href="https://www.linkedin.com/in/abdeljalil-bouzine/" target="_blank" rel="noreferrer" class="underline">linkedin.com/in/abdeljalil-bouzine</a>`;
  }
  if (/github|git hub/i.test(t)) {
    return `My GitHub: <a href="https://github.com/Jalil03" target="_blank" rel="noreferrer" class="underline">github.com/Jalil03</a>. You’ll find repo links on the Projects page too.`;
  }
  if (/(^|\s)(ml|machine learning|projects?|portfolio)(\s|$)|show me ml/i.test(t)) {
    return `Open <strong>Projects</strong> for selected ML & data systems work. Highlights:<br/>• <em>imvl-chatbot</em> – AI chatbot with Mistral LoRA fine-tuning<br/>• <em>mlops-zoomcmap</em> – MLOps utilities<br/>• <em>Voice Control</em> – speech commands<br/>You can also browse everything on <a href="https://github.com/Jalil03" target="_blank" rel="noreferrer" class="underline">GitHub</a>.`;
  }
  if (/(best|favorite|favourite|top)\s+(project|work)/i.test(t)) {
    return `Start with <strong>imvl-chatbot</strong> — an AI chatbot for logistics/training using Mistral LoRA fine-tuning. If you share what you care about (infra, data pipeline, evaluation, latency), I’ll tailor a quick summary.`;
  }
  if (/^\/?help$/.test(t)) {
    return `Shortcuts:<br/>• <code>/clear</code> — clear chat history<br/>• Ask: “Where is your CV?”, “Show me ML work”, “How can I contact you?”, “What’s your best project?”`;
  }
  return `Got it — could you tell me a bit more about what you’re looking for (e.g., a specific project, tech stack, or goal)?`;
}

async function streamReply(userText, onChunk) {
  const full = getReply(userText);
  const chunks = full.split(/(?<=[.!?])\s+/);
  let acc = "";
  for (let i = 0; i < chunks.length; i++) {
    await new Promise((r) => setTimeout(r, 80 + Math.random() * 120));
    acc += (i ? " " : "") + chunks[i];
    onChunk(acc);
  }
}

/* ----------------------- main widget ----------------------- */
export default function ChatWidget() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! How can I help?" }]);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const hasUnread = !open && messages.some((m) => m.role === "user");

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open, typing]);

  useAutogrow(inputRef, input);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const suggestions = useMemo(
    () => ["Who are you?", "Where is your CV?", "How can I contact you?", "Show me ML work", "What’s your best project?", "/help"],
    []
  );

  async function onSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    if (text === "/clear") {
      setMessages([{ role: "assistant", content: "History cleared. How can I help?" }]);
      setInput("");
      return;
    }
    setMessages((m) => [...m, { role: "user", content: text, t: Date.now() }]);
    setInput("");
    setSending(true);
    setTyping(true);
    const idx = messages.length + 1;
    setMessages((m) => [...m, { role: "assistant", content: "", t: Date.now() }]);
    try {
      await streamReply(text, (update) => {
        setMessages((m) => {
          const next = m.slice();
          const newContent = typeof update === "function" ? update(next[idx]?.content ?? "") : String(update ?? "");
          next[idx] = { ...next[idx], content: newContent };
          return next;
        });
      });
    } catch {
      setMessages((m) => {
        const next = m.slice();
        next[idx] = { role: "assistant", content: "Sorry—something went wrong.", t: Date.now() };
        return next;
      });
    } finally {
      setTyping(false);
      setSending(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(e); }
  }

  return (
    <>
      {/* Animations – disabled on small screens & for reduced motion */}
      <style>{`
        @keyframes floaty { 0%{ transform: translateY(0) } 50%{ transform: translateY(-3px) } 100%{ transform: translateY(0) } }
        @keyframes shine  { 0%{ transform: translateX(-120%) } 100%{ transform: translateX(120%) } }
        @keyframes wiggle { 0%,100%{ transform: rotate(0deg) } 50%{ transform: rotate(-8deg) } }
        .fun-fab { animation: floaty 6s ease-in-out infinite; }
        .fun-unread { animation: wiggle 1.8s ease-in-out infinite; transform-origin: 70% 30%; }
        @media (max-width: 767px) {
          .fun-fab, .fun-unread { animation: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fun-fab, .fun-unread { animation: none !important; }
        }
      `}</style>

      {/* CLOSED STATE — FAB */}
      {!open && (
        <button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          title="Chat"
          className={[
            "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60]",
            "group overflow-hidden fun-fab",
            "h-14 w-14 md:h-12 md:w-auto",
            "rounded-full md:rounded-2xl",
            "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white",
            "shadow-2xl ring-1 ring-white/20 md:backdrop-blur", // ⬅️ no blur on mobile
            "flex items-center justify-center md:gap-2 md:px-3 md:pr-3.5",
            "transition-transform hover:scale-105 active:scale-[0.98]",
          ].join(" ")}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 rotate-[25deg] bg-gradient-to-r from-white/0 via-white/35 to-white/0 md:[animation:shine_3.6s_linear_infinite]"
          />
          <span className="pointer-events-none absolute inset-0 rounded-inherit bg-indigo-500/25 md:blur-xl opacity-60 group-hover:opacity-90 transition" />

          {hasUnread && (
            <span className="fun-unread absolute -top-0.5 -right-0.5 md:-right-1 h-3 w-3 rounded-full bg-pink-400 ring-2 ring-black/40 md:ring-white/60" />
          )}

          <span className="md:hidden i-lucide-message-circle relative h-7 w-7" aria-hidden />
          <span className="hidden md:inline-flex h-6 w-6 rounded-full bg-white/20 grid place-items-center">
            <i className="i-lucide-sparkles h-3.5 w-3.5" aria-hidden />
          </span>
          <span className="hidden md:inline relative h-5 overflow-hidden">
            <span className="block translate-y-0 group-hover:-translate-y-5 transition-transform duration-300 text-sm font-medium tracking-tight">Chat</span>
            <span className="absolute inset-x-0 top-5 block -translate-y-0 group-hover:-translate-y-5 transition-transform duration-300 text-sm font-medium tracking-tight">Let’s talk!</span>
          </span>
        </button>
      )}

      {/* BACKDROP – remove blur on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-black/40 md:backdrop-blur-[1px] md:bg-transparent"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* PANEL */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed z-[80] flex flex-col transition-transform ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        } left-0 right-0 bottom-0 top-0 mx-0 rounded-none border-0 bg-[var(--bg-card)]
           md:top-auto md:left-auto md:mx-4 md:mb-4 md:w-[420px] md:max-h-[72vh]
           md:rounded-2xl md:border md:border-white/10 md:bg-white/5 md:backdrop-blur dark:md:bg-black/25`}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/10 p-3 md:p-3.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full border border-white/15 bg-gradient-to-r from-indigo-500 to-purple-500 grid place-items-center">
              <span className="i-lucide-bot h-4 w-4 text-white" aria-hidden />
            </div>
            <div className="text-sm font-semibold text-white">Assistant</div>
            <span className="ml-2 hidden text-[11px] text-muted-foreground sm:inline">Online</span>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs hover:bg-white/20">
            Esc
          </button>
        </div>

        {/* messages */}
        <div ref={listRef} className="flex-1 flex flex-col gap-4 overflow-y-auto p-3 md:p-3.5">
          {messages.map((m, i) => (<Bubble key={i} role={m.role} content={m.content} />))}
          {typing && <TypingDots />}
        </div>

        {/* quick prompts */}
        <div className="flex flex-wrap gap-2 border-t border-white/10 p-2 px-3 md:px-3.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => { setInput(s); setTimeout(() => onSend(), 0); }}
              className="rounded-full border border-indigo-400/20 bg-indigo-500/20 px-3 py-1.5 text-xs hover:bg-indigo-500/30 hover:scale-105 transition"
            >
              {s}
            </button>
          ))}
        </div>

        {/* input */}
        <form onSubmit={onSend} className="flex items-center justify-between border-t border-white/10 p-3 md:p-3.5 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-pink-600/10">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message… ✨"
            className="min-h-[40px] max-h-40 flex-1 resize-none rounded-xl border border-indigo-400/30 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/30 dark:bg-black/25"
          />
          <button
            type="submit"
            disabled={sending || input.trim() === ""}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow hover:scale-105 transition disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}

/* ----------------------- subs ----------------------- */
function Bubble({ role, content }) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-2xl border px-3 py-2 text-sm leading-relaxed ${
          role === "user" ? "border-indigo-400/20 bg-indigo-400/10" : "border-white/10 bg-white/5 dark:bg-black/25"
        }`}
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[82%] rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm dark:bg-black/25">
        <span className="inline-flex gap-1">
          <i className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce motion-reduce:animate-none [animation-delay:0ms]" />
          <i className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce motion-reduce:animate-none [animation-delay:120ms]" />
          <i className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce motion-reduce:animate-none [animation-delay:240ms]" />
        </span>
      </div>
    </div>
  );
}
