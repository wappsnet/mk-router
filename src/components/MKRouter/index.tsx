import { ReactNode, useEffect, useState, FC, useMemo } from 'react';

import { MK_ROUTER_CONTEXT } from 'definitions';
import { MKHistoryDto } from 'types';

export interface MKRouterProps {
  children: ReactNode;
  history: MKHistoryDto;
}

export const MKRouter: FC<MKRouterProps> = ({ children, history }) => {
  const [location, setLocation] = useState(history.location);

  useEffect(
    () =>
      history.listen((newLocation) => {
        setLocation(newLocation);
      }),
    [history],
  );

  const value = useMemo(
    () => ({
      history,
      location,
    }),
    [history, location],
  );

  return <MK_ROUTER_CONTEXT.Provider value={value}>{children}</MK_ROUTER_CONTEXT.Provider>;
};
