import { MKHistoryDto, MKHistoryListenerDto } from 'types';

interface MKHistoryMetaDto {
  listeners?: MKHistoryListenerDto[];
  basePath?: string;
}

export const createHistory = ({ listeners = [], basePath = '' }: MKHistoryMetaDto): MKHistoryDto => {
  const notifyListeners = () => {
    const location = window.location; // Current window location
    listeners?.forEach((listener) => listener(location));
  };

  const generatePath = (path: string) => {
    if (path.startsWith(basePath)) {
      return path;
    }

    return `${basePath}${path}`;
  };

  return {
    get location() {
      return window.location;
    },

    push(path) {
      window.history.pushState(null, '', generatePath(path));
      notifyListeners();
    },

    replace(path) {
      window.history.replaceState(null, '', generatePath(path));
      notifyListeners();
    },

    go(n) {
      window.history.go(n);
      notifyListeners();
    },

    listen(listener) {
      listeners?.push(listener);

      return () => {
        listeners = listeners?.filter((l) => l !== listener);
      };
    },
  };
};
