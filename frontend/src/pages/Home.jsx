// src/pages/Home.jsx
import Hero from '../components/Hero.jsx';
import StatsBar from '../components/StatsBar.jsx';
import FeaturedProjects from '../components/FeaturedProjects.jsx';
import TechStrip from '../components/TechStrip.jsx';

export default function Home({ onNavigate }) {
  return (
    <>
      <Hero onViewProjects={() => onNavigate('projects')} />

      {/* Hide StatsBar on small screens (we show mini-stats in Hero there) */}
      <div className="hidden md:block">
        <StatsBar />
      </div>

      <FeaturedProjects onSeeAll={() => onNavigate('projects')} />
      <TechStrip />
    </>
  );
}
