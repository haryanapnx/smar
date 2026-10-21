import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/shared/components/Icon';

export type AttributeRowProps = {
  icon: IconName;
  label: string;
  value: ReactNode;
};

export const AttributeRow = ({ icon, label, value }: AttributeRowProps) => (
  <div className="flex items-center gap-2 border-b border-slate-100 py-2 last:border-b-0 dark:border-slate-800 sm:gap-3">
    <Icon name={icon} className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300" />
    <dt className="shrink-0 text-xs text-slate-500 dark:text-slate-400 sm:w-24">{label}</dt>
    <dd className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right text-xs font-semibold text-slate-900 dark:text-slate-100">
      {typeof value === 'string' ? <span className="truncate">{value}</span> : value}
    </dd>
  </div>
);
