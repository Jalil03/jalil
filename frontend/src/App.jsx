/* import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
 */



import { useState } from 'react';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Navbar from './components/Navbar.jsx';
import "./index.css"; // <-- REQUIRED so header styles & variables exist


export default function App() {
  const [route, setRoute] = useState('home');
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
            <a className="hover:text-white" href="https://github.com/Jalil03" target="_blank">GitHub</a>
            <a className="hover:text-white" href="#">LinkedIn</a>
            <a className="hover:text-white" href="#">Resume</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
