export default function Filters({ tag, setTag, sort, setSort }) {
  const tags = ['All', 'NLP', 'CV', 'MLOps', 'IoT', 'Big Data', 'Transformers', 'Time Series'];
  const sorts = [{id:'featured',label:'Featured'}, {id:'newest',label:'Newest'}, {id:'stars',label:'Most Starred'}];

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
      <div className="flex flex-wrap gap-2">
        {tags.map(t => (
          <button key={t} onClick={() => setTag(t)}
            className={`text-xs px-2 py-1 rounded-full ${tag===t ? 'bg-accent text-white' : 'bg-elevated text-subtext'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="md:ml-auto">
        <select value={sort} onChange={e=>setSort(e.target.value)}
                className="bg-elevated rounded-xl px-3 py-2 text-sm">
          {sorts.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
    </div>
  );
}
