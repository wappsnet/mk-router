// lib/Redirect.tsx
import { useEffect, FC } from 'react';

import { useMKRouter } from 'hooks';

export interface MKRedirectProps {
  to: string;
}

export const MKRedirect: FC<MKRedirectProps> = ({ to }) => {
  const { history } = useMKRouter();

  useEffect(() => {
    history?.push(to);
  }, [to, history]);

  return null;
};
