export default function StatsBar(){
  const items = [
    { k: "Best Acc.", v: "95.4%", hint: "CViT digits" },
    { k: "IoT F1", v: "0.87", hint: "Rain predictor" },
    { k: "Prod. demos", v: "3", hint: "Live & maintained" },
    { k: "Years", v: "2+", hint: "ML/Full-stack" },
  ];
  return (
    <section className="bg-base">
      <div className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map(x => (
          <div key={x.k} className="bg-card border border-base rounded-xl p-4">
            <div className="text-subtext text-xs">{x.k}</div>
            <div className="text-2xl font-bold">{x.v}</div>
            <div className="text-subtext text-xs mt-1">{x.hint}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
