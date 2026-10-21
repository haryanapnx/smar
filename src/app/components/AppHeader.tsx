import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      {isMenuOpen
        ? createPortal(
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Tutup menu"
              className="fixed inset-0 z-20 bg-slate-950/30 backdrop-blur-sm sm:hidden dark:bg-slate-950/60"
            />,
            document.body,
          )
        : null}

      <div className="relative mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white shadow-sm">
            <BusIcon />
          </span>

          <div>
            <span className="text-base font-bold italic tracking-tight text-brand-700 dark:text-brand-100">
              SMAR
            </span>
            <p className="whitespace-nowrap text-[10px] italic text-slate-500 dark:text-slate-400">
              Sistem Manajemen Armada
            </p>
          </div>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 sm:block">
          <AppNav className="ml-0" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-primary-navigation"
            aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
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

        {isMenuOpen && (
          <div
            id="mobile-primary-navigation"
            className="absolute inset-x-4 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-slate-200 bg-white p-2 shadow-xl sm:hidden dark:border-slate-700 dark:bg-slate-900 pb-4"
          >
            <AppNav mobile onNavigate={closeMenu} />

            <div className="mt-2 flex items-center gap-3 border-t border-slate-200 px-2 pt-3 dark:border-slate-700">
              <span className="grid h-10 w-10 shrink-0 place-items-center text-slate-600  dark:text-slate-300">
                <ThemeToggle />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ubah tema tampilan aplikasi
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
