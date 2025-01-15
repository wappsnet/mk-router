import { useContext, useMemo } from 'react';

import { MK_ROUTER_CONTEXT } from 'definitions';

export const useMKRouter = () => useContext(MK_ROUTER_CONTEXT);

export const useMKQuery = () => {
  const { location } = useMKRouter();

  return useMemo(() => {
    if (!location?.search) {
      return {};
    }

    const params = new URLSearchParams(location.search);
    const entries = params.entries();

    return Object.fromEntries(Array.from(entries));
  }, [location?.search]);
};
