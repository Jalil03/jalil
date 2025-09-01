import { useEffect, useState } from 'react';

const KEY = 'jl-theme'; // 'light' | 'dark'

export function useTheme() {
  const [mode, setMode] = useState('light');

  // initial: saved -> system -> light
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') setMode(saved);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setMode('dark');
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    if (mode === 'dark') el.classList.add('theme-dark');
    else el.classList.remove('theme-dark');
    localStorage.setItem(KEY, mode);
  }, [mode]);

  return { mode, toggle: () => setMode(m => (m === 'dark' ? 'light' : 'dark')) };
}
