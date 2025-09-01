export async function fetchProjects(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`/api/projects${q ? `?${q}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}
