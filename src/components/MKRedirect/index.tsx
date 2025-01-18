// lib/Redirect.tsx
import { useEffect, FC } from 'react';

import { matchPath } from 'helpers';
import { useMKRouter } from 'hooks';

export interface MKRedirectProps {
  to: string;
  path?: string;
  exact?: boolean;
}

export const MKRedirect: FC<MKRedirectProps> = ({ exact = false, path = '*', to }) => {
  const { history } = useMKRouter();

  useEffect(() => {
    if (
      matchPath(history.location.pathname, {
        path,
        strict: exact,
      })
    )
      history?.push(to);
  }, [to, history, path, exact]);

  return null;
};
