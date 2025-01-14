import { createContext } from 'react';

import { MKHistoryDto } from 'types';

export const MK_ROUTER_CONTEXT = createContext<{
  history?: MKHistoryDto;
  location?: Location;
}>({});
