<div align="center">

# 🌌 JL — Personal Portfolio Website

**Modern, fast, and clean portfolio** for Abdeljalil BOUZINE (JL) — Full-Stack Developer & AI/Big Data Enthusiast.  
Built with **React + Vite + Tailwind CSS** and deployed on **Vercel**, with a lightweight **Cloudflare Workers API** for serverless endpoints.

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](#-deployment)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react&logoColor=white)](#-tech-stack)
[![TailwindCSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](#-tech-stack)
[![Cloudflare Workers](https://img.shields.io/badge/API-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](#-serverless-api-cloudflare-workers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

</div>

---

## ✨ Overview

This is my personal website showcasing projects across **MERN**, **AI/Deep Learning**, **Big Data/Streaming (Kafka)**, and **IoT/Edge AI**.  
The app emphasizes:

- ⚡ **Performance** (Vite bundling, lazy loading, image optimization)
- 🌓 **Theming** (dark/light with smooth transitions)
- 💬 **Interactive UX** (custom chat widget, animated sections, ticker)
- 🔒 **Best practices** (CORS-safe serverless endpoints, minimal dependencies)

**Live:** _add your URL here_  
**Repo:** `https://github.com/Jalil03/jalil`

---

## 🧱 Features

- **Hero + About + Skills + Projects + Contact** sections
- **Dark/Light theme toggle** persisted to `localStorage`
- **Projects gallery** with modal details
- **Responsive navbar** (mobile drawer), smooth scrolling
- **Chat Widget** (local persistence, linkified text, inline code styling)
- **Ticker** (infinite marquee, adaptive speed/gap)
- **Contact form** → **Cloudflare Worker** endpoint (CORS-aware)

> _Roadmap:_ SEO meta tags & OpenGraph, blog/notes section, optional Behance sync.

---

## 🔩 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **State/Utils:** localStorage, custom hooks
- **Styling:** CSS variables + Tailwind + utility components
- **Serverless API:** Cloudflare Workers (Wrangler)
- **Deployment:** Vercel (frontend), Cloudflare (API)

---

## 🗂️ Project Structure

```
.
├─ public/                   # static assets
├─ src/
│  ├─ components/
│  │  ├─ Navbar.jsx
│  │  ├─ Hero.jsx
│  │  ├─ Projects/
│  │  │  ├─ ProjectCard.jsx
│  │  │  └─ ProjectDetailsModal.jsx
│  │  ├─ Contact.jsx
│  │  ├─ ChatWidget.jsx
│  │  └─ Ticker.jsx
│  ├─ hooks/
│  │  └─ useTheme.js
│  ├─ styles/               # tailwind.css / variables.css
│  ├─ data/                 # projects.json, skills.ts, etc.
│  ├─ App.jsx
│  └─ main.jsx
├─ functions/               # Cloudflare Pages/Workers functions
│  └─ [[path]].js           # API routes (e.g., /api/contact)
├─ index.html
├─ package.json
└─ tailwind.config.js
```

> If your API lives in a separate repo, keep this folder as an example and link to the backend repo instead.

---

## ⚙️ Getting Started

### 1) Prerequisites
- Node.js ≥ 18
- npm or pnpm
- (Optional) Cloudflare Wrangler CLI for API: `npm i -g wrangler`

### 2) Install
```bash
# clone
git clone https://github.com/Jalil03/jalil
cd jalil

# install deps
npm install
# or pnpm install
```

### 3) Environment Variables
Create `.env` (or `.env.local`) at project root:

```
# Frontend
VITE_API_BASE_URL=https://your-worker-subdomain.workers.dev   # e.g., https://jl-api.workers.dev
VITE_CONTACT_ENDPOINT=/api/contact
VITE_ALLOWED_ORIGIN=https://your-vercel-site.vercel.app       # used by Worker CORS
```

> In your Cloudflare Worker, mirror `ALLOWED_ORIGIN` to the same Vercel URL for CORS.

### 4) Run Locally
```bash
npm run dev
# Vite starts at http://localhost:5173
```

### 5) Build
```bash
npm run build
# output: dist/
```

---

## ☁️ Deployment

### Vercel (Frontend)
1. Import this repo in Vercel.
2. **Framework:** Vite  
   **Build Command:** `npm run build`  
   **Output Directory:** `dist`
3. Add environment variables (`VITE_API_BASE_URL`, etc.).
4. Deploy.

> If you get “no build output directory,” set **Output Directory** = `dist`.

---

## 🔌 Serverless API (Cloudflare Workers)

A minimal Worker to accept contact form submissions with CORS:

```js
// functions/[[path]].js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // basic CORS
    const ALLOWED = env.ALLOWED_ORIGIN || "https://your-vercel-site.vercel.app";
    const headers = {
      "Access-Control-Allow-Origin": ALLOWED,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (url.pathname === "/api/contact" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      // TODO: validate + send email / store in KV / call webhook
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404, headers });
  },
};
```

**Wrangler config example:**
```toml
# wrangler.toml
name = "jl-portfolio-api"
main = "functions/[[path]].js"
compatibility_date = "2024-10-01"

[vars]
ALLOWED_ORIGIN = "https://your-vercel-site.vercel.app"
```

**Deploy:**
```bash
wrangler deploy
# get your workers.dev URL and set it in Vercel as VITE_API_BASE_URL
```

---

## 🧪 Scripts

```bash
npm run dev       # start local dev (Vite)
npm run build     # production build
npm run preview   # preview production build locally
```

---

## 🛡️ Quality

- **Accessibility:** semantic landmarks, focus outlines, color contrast in dark/light
- **Performance:** code-splitting, lazy-loading project modals, compressed images
- **Security:** strict CORS (single origin), input validation planned for contact form

---

## 📸 Screenshots

> Add real screenshots or GIFs here.

| Home (Dark) | Projects (Modal) |
| --- | --- |
| ![Home Dark](./public/screens/home-dark.png) | ![Projects](./public/screens/projects-modal.png) |

---

## 🗺️ Roadmap

- [ ] SEO meta tags & OpenGraph previews
- [ ] Project data from CMS/JSON feed
- [ ] Blog/Notes with MDX
- [ ] Behance sync (projects auto-update)
- [ ] Email delivery (Resend / MailChannels) from Worker

---

## 🙌 Acknowledgements

- Icons via [Devicon](https://devicon.dev/) / [Lucide](https://lucide.dev/)  
- Deploy via [Vercel](https://vercel.com/) & [Cloudflare Workers](https://developers.cloudflare.com/workers/)  
- Built with ❤️ using React + Tailwind + Vite

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
