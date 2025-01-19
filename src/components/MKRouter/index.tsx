import { ReactNode, useEffect, useState, FC, useMemo, useCallback } from 'react';

import { MK_ROUTER_CONTEXT } from 'definitions';
import { MKHistoryDto, MKLocationDto, MKRouteDto } from 'types';

interface MKRouterRenderProps {
  history: MKHistoryDto;
  location: MKLocationDto;
}

export interface MKRouterProps {
  children?: ReactNode;
  render?: (props: MKRouterRenderProps) => ReactNode;
  history: MKHistoryDto;
}

export const MKRouter: FC<MKRouterProps> = ({ children, render, history }) => {
  const [location, setLocation] = useState(history.location);
  const [routes, setRoutes] = useState({});

  useEffect(
    () =>
      history.listen((newLocation) => {
        setLocation(newLocation);
      }),
    [history],
  );

  const handleSetRoute = useCallback((data: MKRouteDto) => {
    setRoutes((prevState) => ({
      ...prevState,
      [data.key]: data,
    }));
  }, []);

  const value = useMemo(
    () => ({
      history,
      location,
      routes,
      addRoute: handleSetRoute,
    }),
    [handleSetRoute, history, location, routes],
  );

  const content = useMemo(() => render?.(value) ?? children, [children, render, value]);

  return <MK_ROUTER_CONTEXT.Provider value={value}>{content}</MK_ROUTER_CONTEXT.Provider>;
};
