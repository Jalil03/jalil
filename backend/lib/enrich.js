// backend/lib/enrich.js
import YAML from "yaml";

const FILE_CANDIDATES = [
  ".portfolio/project.yml",
  ".portfolio/project.yaml",
  ".portfolio/project.json",
  "model-card.yml",
  "model_card.yml",
  "MODEL_CARD.md", // as a README section fallback
];

export function inferModelFramework(topics = [], readme = "", reqs = "") {
  const hay = (topics.join(" ") + " " + readme + " " + reqs).toLowerCase();
  if (hay.includes("pytorch") || hay.includes("torch")) return "PyTorch";
  if (hay.includes("tensorflow") || hay.includes("keras")) return "TensorFlow/Keras";
  if (hay.includes("sklearn")) return "scikit-learn";
  return "Unknown";
}

export function inferTask(topics = [], readme = "") {
  const hay = (topics.join(" ") + " " + readme).toLowerCase();
  if (hay.includes("ocr")) return "OCR";
  if (hay.includes("recommender")) return "Recommender Systems";
  if (hay.includes("nlp") || hay.includes("chatbot")) return "NLP / Chatbot";
  if (hay.includes("cv") || hay.includes("vision") || hay.includes("image")) return "Computer Vision";
  if (hay.includes("lstm") || hay.includes("timeseries") || hay.includes("time series")) return "Time Series";
  return "Machine Learning";
}

function safeParseJSON(txt) {
  try { return JSON.parse(txt); } catch { return null; }
}

function parseMaybeYAMLorJSON(txt) {
  const asJSON = safeParseJSON(txt);
  if (asJSON) return asJSON;
  try { return YAML.parse(txt); } catch { return null; }
}

// Build a simple default model/data card if nothing explicit found
export function buildHeuristicCards({ repo, topics, readme, requirements }) {
  const framework = inferModelFramework(topics, readme, requirements);
  const task = inferTask(topics, readme);

  const modelCard = {
    architecture: "Not specified",
    framework,
    intendedUse: task,
    limitations: "Not formally evaluated; demo quality",
    license: repo.license?.spdx_id || "Unspecified",
  };

  const dataCard = {
    source: "Not specified",
    records: "Unknown",
    splits: "Unknown",
    features: "Unknown",
    preprocessing: "Unknown",
    risks: "Unassessed",
    license: "Dataset-specific / unknown",
  };

  return { modelCard, dataCard };
}

// Merge: explicit > heuristic
export function mergeCards(baseProject, explicitCards, heuristicCards) {
  const merged = { ...baseProject };

  if (explicitCards?.modelCard || heuristicCards?.modelCard) {
    merged.modelCard = { ...(heuristicCards?.modelCard || {}), ...(explicitCards?.modelCard || {}) };
  }
  if (explicitCards?.dataCard || heuristicCards?.dataCard) {
    merged.dataCard  = { ...(heuristicCards?.dataCard  || {}), ...(explicitCards?.dataCard  || {}) };
  }
  return merged;
}

// Attempt to extract model/data card text from README sections like "## Model Card"
export function extractCardsFromReadme(readme) {
  if (!readme) return null;
  const m = /##\s*Model Card([\s\S]*?)(##|$)/i.exec(readme);
  const d = /##\s*Data Card([\s\S]*?)(##|$)/i.exec(readme);
  if (!m && !d) return null;

  const modelCard = m ? { description: m[1].trim() } : undefined;
  const dataCard  = d ? { description: d[1].trim() } : undefined;
  return { modelCard, dataCard };
}

export async function fetchRepoTextFile({ owner, repo, path, headers }) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
  const res = await fetch(url, { headers });
  if (res.ok) return await res.text();
  // try master as fallback
  const url2 = `https://raw.githubusercontent.com/${owner}/${repo}/master/${path}`;
  const res2 = await fetch(url2, { headers });
  if (res2.ok) return await res2.text();
  return null;
}

// Try to load explicit metadata from known files
export async function loadExplicitCards({ owner, repo, headers }) {
  for (const path of FILE_CANDIDATES) {
    const txt = await fetchRepoTextFile({ owner, repo, path, headers });
    if (!txt) continue;

    // JSON/YAML route
    if (path.endsWith(".json") || path.endsWith(".yml") || path.endsWith(".yaml")) {
      const obj = parseMaybeYAMLorJSON(txt);
      if (obj && (obj.modelCard || obj.dataCard)) return obj;
    }

    // markdown fallback (MODEL_CARD.md)
    if (path.toLowerCase().endsWith(".md")) {
      const md = txt.trim();
      if (md.length > 0) return { modelCard: { description: md } };
    }
  }
  return null;
}
