// backend/server.js  (ESM)
import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ⬅️ security middleware (helmet, cors, rate limit, sanitize, hpp, body limits)
import { applySecurity } from "./lib/security.js";

import { fetchMLProjects, authHeaders } from "./lib/github.js";
import {
  loadExplicitCards,
  extractCardsFromReadme,
  fetchRepoTextFile,
  mergeCards,
} from "./lib/enrich.js";

dotenv.config();

const app = express();

// ---------- SECURITY ----------
/**
 * Allow one or more origins. Set ALLOWED_ORIGIN (recommended) or CORS_ORIGIN.
 * Example: ALLOWED_ORIGIN="https://your-site.pages.dev,http://localhost:4173"
 */
const originEnv =
  process.env.ALLOWED_ORIGIN || process.env.CORS_ORIGIN || "http://localhost:4173";
const ALLOWED_ORIGINS = originEnv.split(",").map((s) => s.trim()).filter(Boolean);

// apply all hardening (adds JSON/urlencoded parsers with size limits too)
applySecurity(app, { allowedOrigin: ALLOWED_ORIGINS });

// Logging (keep lightweight; use 'combined' in prod if you want)
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
// --------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Curated local data (rich metadata you already have)
const dataPath = path.join(__dirname, "data", "projects.json");
const curated = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// ---- In-memory cache for GitHub results
let cache = { items: [], ts: 0 };
const TTL_MS = 10 * 60 * 1000; // 10 minutes

function mergeProjects(autoList, curatedList) {
  const bySlug = new Map();
  autoList.forEach((p) => bySlug.set(p.slug, p));

  for (const c of curatedList) {
    const existing = bySlug.get(c.slug);
    if (!existing) {
      bySlug.set(c.slug, c);
    } else {
      bySlug.set(c.slug, {
        ...existing,
        ...c,
        stars: c.stars ?? existing.stars,
        lastUpdated: c.lastUpdated ?? existing.lastUpdated,
        tags: c.tags?.length ? c.tags : existing.tags,
      });
    }
  }
  return Array.from(bySlug.values());
}

// ---- Enrich a single auto-mapped project with repo-side metadata / README sections
async function enrichOne(owner, baseProject) {
  let merged = { ...baseProject };

  const explicit = await loadExplicitCards({
    owner,
    repo: baseProject.title, // repo name == title in mapRepoToProject
    headers: authHeaders(),
  });
  if (explicit) {
    merged = mergeCards(merged, explicit, {}); // explicit only
  }

  const readme =
    (await fetchRepoTextFile({
      owner,
      repo: baseProject.title,
      path: "README.md",
      headers: authHeaders(),
    })) || "";
  const heuristicFromReadme = extractCardsFromReadme(readme);
  if (heuristicFromReadme) {
    merged = mergeCards(merged, heuristicFromReadme, {}); // README sections override where present
  }

  return merged;
}

// ---- Fetch (with caching), enrich, and merge with curated
async function getProjects() {
  const now = Date.now();
  const username = process.env.GITHUB_USERNAME || "Jalil03";

  if (!cache.items.length || now - cache.ts > TTL_MS) {
    try {
      const auto = await fetchMLProjects(username);
      const enriched = await Promise.all(auto.map((p) => enrichOne(username, p)));
      cache = { items: mergeProjects(enriched, curated), ts: now };
    } catch (err) {
      console.error("⚠️ GitHub fetch failed, using curated only:", err.message);
      cache = { items: curated, ts: now };
    }
  }
  return cache.items;
}

// -------------------- Routes --------------------

// Health check (useful for uptime monitors / debugging CORS quickly)
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// GET /api/projects?tag=CV&sort=newest|stars
app.get("/api/projects", async (req, res) => {
  try {
    const { tag, sort } = req.query;
    let result = await getProjects();

    if (tag && tag !== "All") {
      result = result.filter((p) =>
        (p.tags || []).map((t) => t.toLowerCase()).includes(String(tag).toLowerCase())
      );
    }

    if (sort === "newest") {
      result = result.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    } else if (sort === "stars") {
      result = result.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    } else {
      result = result.sort(
        (a, b) =>
          (b.featured === true) - (a.featured === true) ||
          new Date(b.lastUpdated) - new Date(a.lastUpdated)
      );
    }

    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load projects" });
  }
});

// GET /api/projects/:slug
app.get("/api/projects/:slug", async (req, res) => {
  const items = await getProjects();
  const item = items.find((p) => p.slug === req.params.slug);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// Manual warm/refresh endpoint
app.post("/api/_refresh", async (_req, res) => {
  cache = { items: [], ts: 0 };
  await getProjects();
  res.json({ ok: true, refreshedAt: new Date().toISOString() });
});

// 404 + error handlers (keep responses generic in prod)
app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 API on :${PORT}`));
}

export default app;
