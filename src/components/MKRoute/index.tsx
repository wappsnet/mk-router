import { useMemo, ReactNode, FC, ComponentType } from 'react';

import { pathToMatch } from 'helpers';
import { useMKRouter } from 'hooks';
import { MKRouteMatchDto } from 'types';

export interface MKRouteProps {
  path: string;
  exact?: boolean;
  sensitive?: boolean;
  strict?: boolean;
  index?: number;
  children?: ReactNode;
  component?: ComponentType<MKRouteMatchDto>;
  render?: (match: MKRouteMatchDto) => ReactNode;
  guard?: (match: MKRouteMatchDto) => boolean;
}

export const MKRoute: FC<MKRouteProps> = ({
  path,
  exact = false,
  strict = false,
  sensitive = false,
  index = 0,
  children,
  component: Component,
  render,
  guard,
}) => {
  const { location } = useMKRouter();

  const match = useMemo(() => {
    if (!location?.pathname) {
      return null;
    }

    const { pathname } = location;

    return pathToMatch({
      path,
      pathname,
      exact,
      sensitive,
      strict,
    });
  }, [location, path, exact, sensitive, strict]);

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
    return <Component index={index} {...match} />;
  }

  return <>{children}</>;
};
