import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppNav } from './AppNav';
import { ThemeToggle } from './ThemeToggle';

const BusIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M6 2h12a3 3 0 0 1 3 3v9a2 2 0 0 1-2 2v1.5a1.5 1.5 0 0 1-3 0V16H8v1.5a1.5 1.5 0 0 1-3 0V16a2 2 0 0 1-2-2V5a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v3h14V5a1 1 0 0 0-1-1H6Zm-1 6v3h14v-3H5Zm2 1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm10 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
  </svg>
);

export const AppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes (covers back/forward too).
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="relative mx-auto flex h-14 w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8 justify-between">
        <Link
          to="/"
          className="min-w-[10rem] flex items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-white shadow-sm">
            <BusIcon />
          </span>
          <span className="text-base font-bold italic tracking-tight text-brand-700 dark:text-brand-100">
            SMAR
          </span>
        </Link>

        <AppNav className="ml-6 lg:ml-8" />

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-primary-navigation"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span className="sr-only">{isMenuOpen ? 'Tutup menu' : 'Buka menu'}</span>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
        {isMenuOpen ? (
          <div
            id="mobile-primary-navigation"
            className="absolute inset-x-4 top-[calc(100%+0.5rem)] rounded-xl border border-slate-200 bg-white p-1 shadow-xl sm:hidden dark:border-slate-700 dark:bg-slate-900"
          >
            <AppNav mobile onNavigate={closeMenu} />
          </div>
        ) : null}
      </div>
    </header>
  );
};
