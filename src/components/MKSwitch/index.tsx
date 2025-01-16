import { ReactNode, Children, isValidElement, FC, useMemo } from 'react';

import { useMKRouter } from 'hooks';

export interface SwitchProps {
  children: ReactNode;
  indexed?: boolean;
  mandatory?: boolean;
}

export const MKSwitch: FC<SwitchProps> = ({ children, indexed = false }) => {
  const { location } = useMKRouter();

  const routes = useMemo(() => {
    const items = Children.toArray(children).flatMap((child) => {
      if (isValidElement(child) && 'path' in child.props) {
        return [child];
      }

      return [];
    });

    if (indexed) {
      return items.toSorted((prev, next) => next.props.index - prev.props.index);
    }

    return items;
  }, [children, indexed]);

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

    if (indexed) {
      return routes[0];
    }
  }, [indexed, location?.pathname, routes]);

  if (element) {
    return <>{element}</>;
  }
};
