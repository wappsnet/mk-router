import { useMemo, ReactNode, FC } from 'react';

import { useMKRouter } from 'hooks';

export interface MKRouteProps {
  path: string;
  exact?: boolean;
  children: ReactNode;
}

export const MKRoute: FC<MKRouteProps> = ({ path, exact = false, children }) => {
  const { location } = useMKRouter();

  const match = useMemo(() => {
    if (exact) {
      return location?.pathname === path;
    }

    return !!location?.pathname.startsWith(path);
  }, [location?.pathname, path, exact]);

  return match ? <>{children}</> : null;
};
