import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/cn';

const SIZES = {
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
} as const;

export type ModalSize = keyof typeof SIZES;

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: ModalSize;
  footer?: ReactNode;
  className?: string;
};

export const Modal = ({
  open,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  className,
}: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm dark:bg-slate-950/75 sm:p-6"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none dark:border dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-black/70 sm:max-h-[calc(100vh-3rem)]',
          SIZES[size],
          className,
        )}
      >
        <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-5 sm:py-4">
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
};
