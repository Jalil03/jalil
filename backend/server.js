import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "data", "projects.json");

// Load once at boot (edit the JSON file to update)
const projects = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// GET /api/projects?tag=CV&sort=newest
app.get("/api/projects", (req, res) => {
  const { tag, sort } = req.query;
  let result = [...projects];

  if (tag && tag !== "All") {
    result = result.filter((p) => p.tags?.includes(tag));
  }
  if (sort === "newest") {
    result.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  } else if (sort === "stars") {
    result.sort((a, b) => (b.stars || 0) - (a.stars || 0));
  } else {
    // default: featured first, then recently updated
    result.sort((a, b) =>
      (b.featured === true) - (a.featured === true) ||
      new Date(b.lastUpdated) - new Date(a.lastUpdated)
    );
  }
  res.json(result);
});

app.get("/api/projects/:slug", (req, res) => {
  const item = projects.find((p) => p.slug === req.params.slug);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API on :${PORT}`));
