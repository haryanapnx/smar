import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type Theme,
  type ThemeContextValue,
} from './themeContext';

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

const readStoredTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    /* localStorage unavailable */
  }
  return 'system';
};

const systemPrefersDark = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(DARK_MEDIA_QUERY).matches
    : false;

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const [systemDark, setSystemDark] = useState<boolean>(systemPrefersDark);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const media = window.matchMedia(DARK_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
