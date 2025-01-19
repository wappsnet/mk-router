import { ReactNode, Children, isValidElement, FC, useMemo, useEffect } from 'react';

import { matchPath } from 'helpers';
import { useMKRouter } from 'hooks';

export interface SwitchProps {
  children: ReactNode;
  index?: string;
  mandatory?: boolean;
}

export const MKSwitch: FC<SwitchProps> = ({ children, index, mandatory = false }) => {
  const { location, history } = useMKRouter();

  const routes = useMemo(
    () =>
      Children.map(children, (child) => {
        if (isValidElement(child) && 'path' in child.props) {
          return child;
        }
      })?.flatMap((child) => {
        if (child) {
          return [child];
        }

        return [];
      }),
    [children],
  );

  console.log(routes);

  const element = useMemo(() => {
    const matched = routes?.find((child) => {
      const { path, exact } = child.props;

      console.info(path, exact);
      return !!matchPath(location.pathname, {
        path: path,
        strict: !!exact,
      });
    });

    if (matched) {
      return {
        action: null,
        node: matched,
      };
    }

    if (index) {
      return {
        action: () => history.push(index),
        node: null,
      };
    }

    if (mandatory && routes?.length) {
      return {
        action: () => history.push(routes[0].props.path),
        node: null,
      };
    }
  }, [history, index, location?.pathname, mandatory, routes]);

  useEffect(() => {
    element?.action?.();
  }, [element, element?.action]);

  console.info(element?.node);

  if (element?.node) {
    return <>{element.node}</>;
  }
};
