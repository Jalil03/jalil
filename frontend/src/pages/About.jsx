export default function About(){
  return (
    <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
      <h2 className="text-2xl font-bold">About</h2>
      <p className="text-subtext mt-2 max-w-prose">
        I’m JL, a Moroccan ML engineer (Master AIDC) focused on computer vision, time-series, and MLOps.
        I turn rough data into reliable systems with clear metrics and clean UX.
      </p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-card/80 rounded-2xl p-4"><h3 className="font-semibold">ML</h3><p className="text-subtext text-sm">PyTorch, CV, NLP, LSTM, Transformers</p></div>
        <div className="bg-card/80 rounded-2xl p-4"><h3 className="font-semibold">MLOps</h3><p className="text-subtext text-sm">Docker, CI/CD, Tracking, Deploy</p></div>
        <div className="bg-card/80 rounded-2xl p-4"><h3 className="font-semibold">Data/Cloud</h3><p className="text-subtext text-sm">Kafka, Spark, MongoDB, REST</p></div>
      </div>
    </section>
  );
}
