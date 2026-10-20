import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <section className="flex flex-col items-center justify-center gap-3 py-20 text-center">
    <p className="text-5xl font-semibold text-brand-700 dark:text-brand-400">404</p>
    <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Page not found</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      The page you are looking for does not exist.
    </p>
    <Link
      to="/vehicles"
      className="mt-2 rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800"
    >
      Back to vehicles
    </Link>
  </section>
);
