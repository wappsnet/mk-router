import { useContext, useMemo } from 'react';

import { MK_ROUTER_CONTEXT } from 'definitions';

export const useMKRouter = () => {
  const context = useContext(MK_ROUTER_CONTEXT);

  return {
    history: context.history,
    location: context.history.location,
  };
};

export const useMKLocation = () => {
  const { location } = useMKRouter();

  return location;
};

export const useMKQuery = () => {
  const location = useMKLocation();

  return useMemo(() => {
    if (!location?.search) {
      return {};
    }

    const params = new URLSearchParams(location.search);
    const entries = params.entries();

    return Object.fromEntries(Array.from(entries));
  }, [location?.search]);
};
