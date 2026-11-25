import { useEffect, useState } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  useGrouping?: boolean;
}

/**
 * Smooth cubic ease-out count-up hook driven by requestAnimationFrame.
 * Respects prefers-reduced-motion by jumping directly to the final value.
 */
export function useCountUp({
  end,
  duration = 2200,
  delay = 0,
  decimals = 0,
  useGrouping = true,
}: UseCountUpOptions): string {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setValue(end);
      return;
    }

    let rafId = 0;
    let startTime: number | null = null;

    const timeoutId = window.setTimeout(() => {
      const tick = (now: number) => {
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(end * eased);

        if (t < 1) {
          rafId = window.requestAnimationFrame(tick);
        } else {
          setValue(end);
        }
      };

      rafId = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [end, duration, delay]);

  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  const rounded = Math.round(value);
  return useGrouping ? rounded.toLocaleString('en-US') : String(rounded);
}
