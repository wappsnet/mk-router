import { useMemo, ReactNode, FC, ComponentType } from 'react';

import { pathToRegexp } from 'helpers';
import { useMKRouter } from 'hooks';
import { MKRouteMatchDto } from 'types';

export interface MKRouteProps {
  path: string;
  exact?: boolean;
  children?: ReactNode;
  component?: ComponentType<MKRouteMatchDto>;
  render?: (match: MKRouteMatchDto) => ReactNode;
  guard?: (match: MKRouteMatchDto) => boolean;
}

export const MKRoute: FC<MKRouteProps> = ({ path, exact = false, children, component: Component, render, guard }) => {
  const { location } = useMKRouter();

  const match = useMemo(() => {
    if (!location?.pathname) {
      return null;
    }

    return pathToRegexp({
      path,
      pathname: location.pathname,
      exact,
    });
  }, [location?.pathname, path, exact]);

  if (!match) {
    return null;
  }

  if (guard && !guard(match)) {
    return null;
  }

  if (render) {
    return <>{render(match)}</>;
  }

  if (Component) {
    return <Component {...match} />;
  }

  return <>{children}</>;
};
