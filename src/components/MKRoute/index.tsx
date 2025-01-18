import { useMemo, ReactNode, FC, ComponentType } from 'react';

import { pathToProps } from 'helpers';
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
  index = 0,
  children,
  component: Component,
  render,
  guard,
}) => {
  const { history } = useMKRouter();

  const match = useMemo(
    () =>
      pathToProps({
        path: history.location.pathname,
        match: path,
        exact,
      }),
    [history.location.pathname, path, exact],
  );

  const props = useMemo(() => {
    if (match) {
      return {
        ...match,
        location: history.location,
        history: history,
      };
    }
  }, [history, match]);

  if (!props) {
    return null;
  }

  if (guard && !guard(props)) {
    return null;
  }

  if (render) {
    return <>{render(props)}</>;
  }

  if (Component) {
    return <Component index={index} {...props} />;
  }

  return <>{children}</>;
};
