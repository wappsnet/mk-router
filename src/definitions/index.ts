import { createContext } from 'react';

import { createHistory } from 'helpers';
import { MKHistoryDto, MKRouteDto, MKRoutesDto } from 'types';

const initialHistory = createHistory({
  basename: '',
});

export const MK_ROUTER_CONTEXT = createContext<{
  history: MKHistoryDto;
  routes?: MKRoutesDto;
  setRoute?: (data: MKRouteDto) => void;
}>({
  history: initialHistory,
  routes: {},
});
