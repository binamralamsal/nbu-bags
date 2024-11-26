import { useEffect } from "react";

import nProgress from "nprogress";

export function useFormDirtyState(condition: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (condition) {
        event.preventDefault();

        nProgress.done();
        return true;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [condition]);
}
