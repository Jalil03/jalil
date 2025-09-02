// Cloudflare Pages Function: forwards /api/* to your Vercel backend
export async function onRequest({ request, params }) {
  const url = new URL(request.url);
  const backend = `https://jalil-tau.vercel.app/api/${params.path || ""}${url.search}`;

  const init = {
    method: request.method,
    headers: request.headers,
  };

  // pass through body for non-GET/HEAD
  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.arrayBuffer();
  }

  return fetch(backend, init);
}
