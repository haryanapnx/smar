export const AppFooter = () => (
  <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
    <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8 dark:text-slate-400">
      <p>
        <span className="font-semibold text-brand-700 dark:text-brand-200">SMAR</span> — Sistem
        Manajemen Armada
      </p>
      <p>Data kendaraan: MBTA API v3</p>
    </div>
  </footer>
);
