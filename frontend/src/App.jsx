// src/App.jsx
import { useEffect, useState, lazy, Suspense } from "react";
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Navbar from './components/Navbar.jsx';
// ⬇️ lazy import (was: import ChatWidget from './components/ChatWidget.jsx')
const ChatWidget = lazy(() => import('./components/ChatWidget.jsx'));
import "./index.css";

export default function App() {
  const [route, setRoute] = useState('home');
  const [showChat, setShowChat] = useState(false);

  // load the chat when the browser is idle (keeps Mobile LCP fast)
  useEffect(() => {
    let id;
    if ('requestIdleCallback' in window) {
      id = window.requestIdleCallback(() => setShowChat(true), { timeout: 2000 });
    } else {
      id = setTimeout(() => setShowChat(true), 1200);
    }
    return () => {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, []);

  const cvHref = `${import.meta.env.BASE_URL || '/'}cv.pdf`;

  return (
    <div className="min-h-screen bg-base text-text">
      <Navbar onNavigate={setRoute} route={route} />

      {route === 'home' && <Home onNavigate={setRoute} />}
      {route === 'projects' && <Projects />}
      {route === 'about' && <About />}
      {route === 'contact' && <Contact />}

      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8 text-subtext text-sm flex flex-col md:flex-row gap-2 md:gap-6 md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} JL. Built with MERN.</p>
          <nav className="flex gap-4">
            <a className="hover:text-white" href="https://github.com/Jalil03" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="hover:text-white" href="https://www.linkedin.com/in/abdeljalil-bouzine/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="hover:text-white" href={cvHref} target="_blank" rel="noopener noreferrer">Resume</a>
          </nav>
        </div>
      </footer>

      {/* Chatbot: only mounts after idle */}
      {showChat && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
    </div>
  );
}
