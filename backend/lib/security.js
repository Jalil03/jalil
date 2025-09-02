// backend/lib/security.js (ESM)
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import express from "express";

export function applySecurity(app, { allowedOrigin }) {
  // you’re likely behind a proxy (Vercel/Cloudflare/Nginx)
  app.set("trust proxy", 1);

  // no framework fingerprinting
  app.disable("x-powered-by");

  // safe parsers with size caps (prevents mem DoS)
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: false, limit: "100kb" }));

  // CORS: allow only your frontend origin
  app.use(
    cors({
      origin: allowedOrigin,                  // e.g. https://<your>.pages.dev
      credentials: true,                      // OK even if you don't use cookies (future-proof)
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // security headers (CSP handled at the frontend/CDN)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    })
  );

  // block NoSQL operator injection ($, .)
  app.use(mongoSanitize());

  // prevent HTTP Parameter Pollution (?id=1&id=2)
  app.use(hpp());

  // basic rate limiting for /api/*
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,                 // 300 req / 15 min / IP (tune later)
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });
  app.use("/api/", limiter);
}
