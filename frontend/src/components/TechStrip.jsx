export default function TechStrip(){
  const tech = ["PyTorch","FastAPI","Kafka","Spark","React","Vite","MongoDB","Docker"];
  return (
    <section className="bg-base">
      <div className="container py-8">
        <div className="bg-card border border-base rounded-xl p-4 flex flex-wrap gap-2 justify-center">
          {tech.map(t => <span key={t} className="badge">{t}</span>)}
        </div>
      </div>
    </section>
  );
}
