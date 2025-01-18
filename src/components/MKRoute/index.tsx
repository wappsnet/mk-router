import { useMemo, ReactNode, FC, ComponentType } from 'react';

import { pathToProps } from 'helpers';
import { useMKLocation } from 'hooks';
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
  index = 0,
  children,
  component: Component,
  render,
  guard,
}) => {
  const { pathname } = useMKLocation();

  const match = useMemo(
    () =>
      pathToProps({
        path: pathname,
        match: path,
        exact,
      }),
    [pathname, path, exact],
  );

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
