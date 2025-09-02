// Vercel serverless entry – reuse your existing Express app
import app from "../server.js";
export default (req, res) => app(req, res);
