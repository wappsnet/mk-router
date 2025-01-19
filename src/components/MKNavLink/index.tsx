import { ReactNode, FC, MouseEvent, AnchorHTMLAttributes, useMemo, useCallback, memo } from 'react';

import { clsx } from 'clsx';

import { useMKLocation, useMKRouter } from 'hooks';

export interface MKNavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
  replace?: boolean;
  activeClassName?: string;
  exact?: boolean;
  isExternal?: boolean;
}

export const MKNavLinkPure: FC<MKNavLinkProps> = ({
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
  const { history } = useMKRouter();
  const { pathname } = useMKLocation();

  const isActive = useMemo(() => {
    if (exact) {
      return pathname === to;
    }
    return pathname.startsWith(to);
  }, [pathname, to, exact]);

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

export const MKNavLink = memo(MKNavLinkPure);
