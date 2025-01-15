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

export const pathToRegexp = ({
  path,
  pathname,
  exact = false,
}: {
  path: string;
  pathname: string;
  exact?: boolean;
}) => {
  const routeParts = path.split('/').filter(Boolean); // Split path into parts
  const urlParts = pathname.split('/').filter(Boolean); // Split pathname into parts

  // If exact match is required, ensure part lengths match
  if (exact && routeParts.length !== urlParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  // Iterate over route parts and compare with URL parts
  for (let i = 0; i < routeParts.length; i++) {
    const routeSegment = routeParts[i];
    const urlSegment = urlParts[i];

    // If URL segment is missing, allow partial matches for non-exact paths
    if (!urlSegment) {
      if (exact) {
        return null;
      }

      return {
        path,
        params,
      };
    }

    if (routeSegment.startsWith(':')) {
      // Extract dynamic parameter value (e.g., `:id` -> "123")
      const paramName = routeSegment.slice(1); // Remove `:`
      params[paramName] = urlSegment;
    } else if (routeSegment !== urlSegment) {
      // Static segment mismatch, so no match
      return null;
    }
  }

  return {
    path,
    params,
  };
};
