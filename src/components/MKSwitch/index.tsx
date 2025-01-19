import { ReactNode, Children, isValidElement, FC, useMemo } from 'react';

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
      Children.toArray(children).flatMap((child) => {
        if (isValidElement(child) && 'path' in child.props) {
          return [child];
        }

        return [];
      }),
    [children],
  );

  const element = useMemo(() => {
    const matched = routes?.find((child) => {
      const { path, exact } = child.props;

      if (exact) {
        return location?.pathname === path;
      }

      return !!location?.pathname.startsWith(path);
    });

    if (matched) {
      return matched;
    }

    if (index) {
      return history.push(index);
    }

    if (mandatory) {
      return history.push(routes[0].props.path);
    }
  }, [history, index, location?.pathname, mandatory, routes]);

  if (element) {
    return <>{element}</>;
  }
};
