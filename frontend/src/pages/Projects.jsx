import { useEffect, useState } from 'react';
import { fetchProjects } from '../api';
import ProjectCard from '../components/ProjectCard.jsx';
import Filters from '../components/Filters.jsx';

export default function Projects(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState('All');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    setLoading(true);
    fetchProjects({ tag, sort }).then(d => setItems(d)).finally(()=>setLoading(false));
  }, [tag, sort]);

  return (
    <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <p className="text-subtext">Selected machine learning and data systems work.</p>
      </div>
      <Filters tag={tag} setTag={setTag} sort={sort} setSort={setSort} />
      {loading ? (
        <p className="mt-10 text-subtext">Loading…</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {items.map(p => <ProjectCard key={p.slug} p={p} />)}
        </div>
      )}
    </section>
  );
}
