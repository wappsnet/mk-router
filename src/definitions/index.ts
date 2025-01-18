import { createContext } from 'react';

import { createHistory } from 'helpers';
import { MKHistoryDto } from 'types';

const initialHistory = createHistory({
  basename: '',
});

export const MK_ROUTER_CONTEXT = createContext<{
  history: MKHistoryDto;
}>({
  history: initialHistory,
});
