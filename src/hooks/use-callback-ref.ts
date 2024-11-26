import { useEffect, useMemo, useRef } from "react";

// Credit: https://github.com/radix-ui/primitives/blob/main/packages/react/use-callback-ref/src/useCallbackRef.tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T | undefined,
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  // https://github.com/facebook/react/issues/19240
  return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}
