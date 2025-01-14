import { ReactNode, FC, AnchorHTMLAttributes } from 'react';

import { useMKRouter } from 'hooks';

export interface MKLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
}

export const MKLink: FC<MKLinkProps> = ({ to, children, onClick, ...props }) => {
  const { history } = useMKRouter();

  return (
    <a
      {...props}
      href={to}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
        history?.push(to);
      }}
    >
      {children}
    </a>
  );
};
