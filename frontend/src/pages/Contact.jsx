export default function Contact(){
  return (
    <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 max-w-2xl">
      <h2 className="text-2xl font-bold">Contact</h2>
      <p className="text-subtext mt-2">Send a quick note—I'll reply soon.</p>
      <form className="mt-6 grid gap-4">
        <input placeholder="Name" className="bg-elevated rounded-xl px-4 py-3" />
        <input placeholder="Email" className="bg-elevated rounded-xl px-4 py-3" />
        <textarea placeholder="Message" rows="5" className="bg-elevated rounded-xl px-4 py-3"></textarea>
        <button type="button" className="px-4 py-2 rounded-xl bg-accent text-white w-fit">Send</button>
      </form>
    </section>
  );
}
