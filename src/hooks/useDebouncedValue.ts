"use client";

import { useEffect, useState } from "react";

/**
 * The value, held back until it has stopped changing for `delay` ms.
 *
 * For inputs that drive a request: a typed keyword or a dragged slider would
 * otherwise fire one query per keystroke or per step of the drag.
 */
export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
