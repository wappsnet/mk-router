import { useMemo, ReactNode, ComponentType, isValidElement, cloneElement, useEffect, FC, memo } from 'react';

import { createLocationKey, pathToProps } from 'helpers';
import { useMKRouter } from 'hooks';
import { MKPathParams, MKRouteMatchDto } from 'types';

export interface MKRouteProps {
  path: string;
  exact?: boolean;
  sensitive?: boolean;
  strict?: boolean;
  children?: ReactNode;
  component?: ComponentType<MKPathParams>;
  render?: (match: MKRouteMatchDto) => ReactNode;
  guard?: (match: MKRouteMatchDto) => boolean;
}

export const MKRoutePure: FC<MKRouteProps> = ({
  path,
  exact = false,
  children,
  component: Component,
  render,
  guard,
  strict,
  sensitive,
}) => {
  const { location, setRoute } = useMKRouter();

  const match = useMemo(
    () =>
      pathToProps({
        path: location.pathname,
        match: path,
        exact,
      }),
    [location.pathname, path, exact],
  );

  const props = useMemo(() => {
    if (match) {
      return {
        ...match,
        location: location,
      };
    }
  }, [location, match]);

  const node = useMemo(() => {
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
      return <Component {...props.params} />;
    }

    if (isValidElement(children)) {
      return (
        <>
          {cloneElement(children, {
            ...children.props,
            ...props.params,
          })}
        </>
      );
    }

    return <>{children}</>;
  }, [Component, children, guard, props, render]);

  useEffect(() => {
    setRoute?.({
      key: createLocationKey(location),
      location: location,
      path,
      node,
      exact,
      strict,
      sensitive,
    });
  }, [path, node, setRoute, location, exact, strict, sensitive]);

  return node;
};

export const MKRoute = memo(MKRoutePure);
