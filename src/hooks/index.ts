import { useContext, useMemo } from 'react';

import { MK_ROUTER_CONTEXT } from 'definitions';
import { createLocationKey, pathToProps } from 'helpers';

export const useMKRouter = () => {
  const context = useContext(MK_ROUTER_CONTEXT);

  return {
    history: context.history,
    location: context.history.location,
    routes: context.routes,
    setRoute: context.setRoute,
  };
};

export const useMKLocation = () => {
  const { location } = useMKRouter();

  return location;
};

export const useMKParams = () => {
  const { location, routes } = useMKRouter();
  const hash = useMemo(() => createLocationKey(location), [location]);

  const route = useMemo(() => routes?.[hash], [hash, routes]);

  return useMemo(() => {
    if (route?.location.pathname) {
      const props = pathToProps({
        match: route?.location.pathname,
        path: location.pathname,
        exact: true,
      });

      return props?.params ?? {};
    }

    return {};
  }, [location.pathname, route?.location.pathname]);
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
