import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';
import { Icon, type IconName } from './Icon';
import { Spinner } from './Spinner';

export type MultiSelectOption = {
  value: string;
  label: string;
};

export type MultiSelectDropdownProps = {
  label: string;
  icon?: IconName;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  isLoading?: boolean;
  className?: string;
};

export const MultiSelectDropdown = ({
  label,
  icon = 'route',
  options,
  selected,
  onChange,
  isLoading = false,
  className,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const visibleOptions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(term));
  }, [options, query]);

  const toggleOption = (value: string) =>
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:ring-brand-900/30',
        className,
      )}
    >
      <p className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
        <Icon name={icon} className="h-4 w-4 text-brand-600" />
        {label}
      </p>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="mt-2 flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs transition hover:border-brand-300 hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
      >
        <span
          className={cn(
            'truncate',
            selected.length ? 'text-slate-700 dark:text-slate-100' : 'text-slate-400',
          )}
        >
          {selected.length
            ? `${selected.length} ${label.toLowerCase()} dipilih`
            : `Pilih ${label.toLowerCase()}…`}
        </span>
        <Icon
          name="chevron"
          className={cn(
            'h-4 w-4 shrink-0 text-slate-400 transition',
            isOpen && 'rotate-90',
          )}
        />
      </button>

      {selected.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleOption(value)}
              className="inline-flex max-w-full items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[10px] font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-100 dark:hover:bg-brand-900/70"
            >
              <span className="truncate">{value}</span>
              <Icon name="close" className="h-3 w-3 shrink-0" />
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-slate-400">Cari dan pilih lebih dari satu.</p>
      )}

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Cari ${label.toLowerCase()}…`}
            aria-label={`Cari ${label.toLowerCase()}`}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />

          <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Spinner label="Memuat…" />
              </div>
            ) : (
              visibleOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-brand-900/30"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                  />
                  <span className="truncate">{option.label}</span>
                </label>
              ))
            )}

            {!isLoading && !visibleOptions.length ? (
              <p className="px-2 py-3 text-center text-xs text-slate-400">Tidak ada hasil.</p>
            ) : null}
          </div>

          <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onChange([])}
              className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-200"
            >
              Bersihkan
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md bg-brand-700 px-3 py-1 text-[11px] font-medium text-white hover:bg-brand-800"
            >
              Selesai
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
