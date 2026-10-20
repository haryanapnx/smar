import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';

const NAV_ITEMS = [
  { to: '/vehicles', label: 'Fleet Management', active: true },
  { to: '/vehicles', label: 'Map', active: false },
  { to: '/vehicles', label: 'Routes', active: false },
  { to: '/vehicles', label: 'Trips', active: false },
];

export const AppNav = ({ className, mobile = false }: { className?: string; mobile?: boolean }) => (
  <nav
    className={cn(
      mobile ? 'flex flex-col items-stretch p-2' : 'hidden items-center gap-1 sm:flex',
      className,
    )}
    aria-label="Primary"
  >
    {NAV_ITEMS.map((item) => (
      <NavLink
        key={item.label}
        to={item.to}
        className={({ isActive }) =>
          cn(
            'relative rounded-lg px-3 py-3 text-xs font-semibold transition after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full',
            isActive && item.active
              ? 'bg-brand-50 text-brand-700 after:bg-brand-600 dark:bg-brand-900/30 dark:text-brand-200'
              : 'text-slate-600 after:scale-x-0 after:bg-brand-600 hover:bg-slate-50 hover:text-brand-700 hover:after:scale-x-100 dark:text-slate-300 dark:hover:bg-slate-800',
          )
        }
      >
        {item.label}
      </NavLink>
    ))}
  </nav>
);
