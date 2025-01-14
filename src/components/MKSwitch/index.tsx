import { ReactNode, Children, isValidElement, FC, useMemo } from 'react';

import { useMKRouter } from 'hooks';

export interface SwitchProps {
  children: ReactNode;
}

export const MKSwitch: FC<SwitchProps> = ({ children }) => {
  const { location } = useMKRouter();

  const element = useMemo(
    () =>
      Children.toArray(children).find((child) => {
        if (isValidElement(child)) {
          const { path, exact } = child.props;
          if (exact) {
            return location?.pathname === path;
          }
          return !!location?.pathname.startsWith(path);
        }
      }),
    [children, location?.pathname],
  );

  return <>{element}</>;
};
