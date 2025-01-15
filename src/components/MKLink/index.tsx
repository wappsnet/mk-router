import { ReactNode, FC, MouseEvent, AnchorHTMLAttributes, useMemo, useCallback } from 'react';

import { clsx } from 'clsx';

import { useMKRouter } from 'hooks';

export interface MKLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
  replace?: boolean;
  activeClassName?: string;
  exact?: boolean;
  isExternal?: boolean;
}

export const MKLink: FC<MKLinkProps> = ({
  to,
  children,
  onClick,
  replace = false,
  activeClassName = 'active',
  exact = false,
  isExternal = false,
  className = '',
  ...props
}) => {
  const { history, location } = useMKRouter();

  const isActive = useMemo(() => {
    if (!location) {
      return false;
    }

    if (exact) {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to);
  }, [location, to, exact]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!isExternal) {
        e.preventDefault();
        if (replace) {
          history?.push(to);
        } else {
          history?.push(to);
        }
      }

      onClick?.(e);
    },
    [history, isExternal, onClick, replace, to],
  );

  return (
    <a {...props} className={clsx(className, { [activeClassName]: isActive })} href={to} onClick={handleClick}>
      {children}
    </a>
  );
};
