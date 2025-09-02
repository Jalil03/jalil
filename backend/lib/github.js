// backend/lib/github.js
const GITHUB_API = "https://api.github.com";

export const ML_TOPICS = [
  "ml", "ai", "cv", "nlp", "pytorch", "tensorflow",
  "deep-learning", "machine-learning", "computer-vision"
];

export const KEYWORDS = [
  "ml","ai","ocr","vision","cv","transformer","lstm",
  "torch","pytorch","recommender","nlp","autoencoder","cnn","vit","chatbot"
];

export function authHeaders() {
  const h = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "jl-portfolio-backend",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`GitHub ${res.status} ${url}`);
  return res.json();
}

export async function fetchUserRepos(username) {
  const url = `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated&direction=desc`;
  return fetchJSON(url);
}

const WHITELIST = ["imvl-chatbot"]; // optional manual force-include

export function isMLRepo(repo) {
  if (WHITELIST.includes(repo.name.toLowerCase())) return true;

  if (Array.isArray(repo.topics) && repo.topics.length > 0) {
    const set = new Set(repo.topics.map((t) => t.toLowerCase()));
    if (ML_TOPICS.some((t) => set.has(t))) return true;
  }

  const text = `${repo.name ?? ""} ${repo.description ?? ""}`.toLowerCase();
  if (KEYWORDS.some((k) => text.includes(k))) return true;

  return false;
}

export function mapRepoToProject(repo, owner) {
  const slug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const cover = `https://opengraph.githubassets.com/1/${owner}/${repo.name}`;
  return {
    title: repo.name,
    slug,
    subtitle: repo.description || "",
    description: repo.description || "",
    tags: repo.topics || [],
    cover,
    github: repo.html_url,
    demo: "",
    stars: repo.stargazers_count ?? 0,
    lastUpdated: repo.pushed_at || repo.updated_at,
    featured: false,
    metrics: {},
  };
}

// 🔹 Add this: fetch repos → filter ML → map to your project shape
export async function fetchMLProjects(username) {
  const repos = await fetchUserRepos(username);
  const ml = repos.filter(isMLRepo);
  return ml.map((r) => mapRepoToProject(r, username));
}
// -------------------- Heuristic and explicit cards --------------------