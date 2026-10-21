import { useEffect, useRef } from 'react';

export type UseIntersectionObserverOptions = {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
};

export const useIntersectionObserver = <T extends Element>({
  onIntersect,
  enabled = true,
  rootMargin = '120px',
}: UseIntersectionObserverOptions) => {
  const ref = useRef<T | null>(null);
  const callbackRef = useRef(onIntersect);

  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          callbackRef.current();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return ref;
};
