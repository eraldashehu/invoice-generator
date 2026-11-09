import { useEffect, useReducer, useRef } from 'react';
import type { Dispatch, Reducer } from 'react';

interface Options<S> {
  /** localStorage key */
  key: string;
  /** Wait this long after the last change before saving (ms). */
  debounceMs?: number;
  /** Validates/migrates whatever was stored. Return null to fall back to `initial`. */
  parse?: (raw: unknown) => S | null;
}

function readStorage<S>(key: string, initial: S, parse?: (raw: unknown) => S | null): S {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return initial;
    const value: unknown = JSON.parse(raw);
    return parse ? (parse(value) ?? initial) : (value as S);
  } catch {
    return initial;
  }
}

/**
 * useReducer that restores its state from localStorage and saves it back,
 * debounced so fast typing does not write on every keystroke.
 * The latest state is also saved when the tab is hidden or closed.
 */
export function usePersistentReducer<S, A>(
  reducer: Reducer<S, A>,
  initial: S,
  { key, debounceMs = 400, parse }: Options<S>
): [S, Dispatch<A>] {
  const [state, dispatch] = useReducer(reducer, initial, (init) => readStorage(key, init, parse));
  const latest = useRef(state);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    latest.current = state;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => save(key, state), debounceMs);
  }, [key, state, debounceMs]);

  useEffect(() => {
    const flush = () => {
      window.clearTimeout(timer.current);
      save(key, latest.current);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      flush();
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [key]);

  return [state, dispatch];
}

function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode): the app keeps working for this visit.
  }
}
