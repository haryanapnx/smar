import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import { ThemeToggle } from './ThemeToggle';

const K_NAV_ITEMS = [
  { to: '/vehicles', label: 'Manajemen Armada' },
  { to: '/routes', label: 'Rute' },
];

export type AppNavProps = {
  className?: string;
  mobile?: boolean;
  onNavigate?: () => void;
};

export const AppNav = ({ className, mobile = false, onNavigate }: AppNavProps) => (
  <nav
    className={cn(
      mobile ? 'flex flex-col items-stretch p-2 ' : 'hidden items-center gap-1 sm:flex',
      className,
    )}
    aria-label="Primary"
  >
    {K_NAV_ITEMS.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'relative rounded-lg px-3 py-3 text-xs font-semibold transition after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full',
            isActive
              ? 'text-brand-700 after:bg-brand-600 dark:text-brand-200'
              : 'text-slate-600 after:scale-x-0 after:bg-brand-600 hover:text-brand-700 hover:after:scale-x-100 dark:text-slate-300 dark:hover:bg-slate-800',
          )
        }
      >
        {item.label}
      </NavLink>
    ))}
    <div className="lg:hidden">
      <ThemeToggle />
    </div>
  </nav>
);
