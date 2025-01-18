import { MKHistoryDto, MKHistoryListenerDto, MKPathDto } from 'types';

interface MKHistoryMetaDto {
  listeners?: MKHistoryListenerDto[];
  basename?: string;
}

export const createHistory = ({ listeners = [], basename = '' }: MKHistoryMetaDto): MKHistoryDto => {
  const notifyListeners = () => {
    const location = window.location; // Current window location
    listeners?.forEach((listener) => listener(location));
  };

  const generatePath = (path: string) => {
    if (path.startsWith(basename)) {
      return path;
    }

    return `${basename}${path}`;
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

export const pathToProps = ({ match, path, exact = false }: { match: string; path: string; exact?: boolean }) => {
  const pathParts = path.split('/').filter(Boolean); // Split path into parts
  const matchParts = match.split('/').filter(Boolean); // Split pathname into parts

  if (exact && pathParts.length !== matchParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < pathParts.length; i++) {
    const routeSegment = pathParts[i];
    const matchSegment = matchParts[i];

    if (!matchSegment) {
      if (exact) {
        return null;
      }

      return {
        path,
        params,
      };
    }

    if (routeSegment.startsWith(':')) {
      const paramName = routeSegment.slice(1); // Remove `:`
      params[paramName] = matchSegment;
    } else if (routeSegment !== matchSegment) {
      return null;
    }
  }

  return {
    path,
    params,
  };
};

export function invariant(value: boolean, message?: string): asserts value;
export function invariant(value: any, message?: string) {
  if (value === false || value === null || typeof value === 'undefined') {
    throw new Error(message);
  }
}

export function warning(cond: any, message: string) {
  if (!cond) {
    if (typeof console !== 'undefined') {
      console.warn(message);
    }

    throw new Error(message);
  }
}

export function parsePath(path: string): Partial<MKPathDto> {
  const parsedPath = {
    pathname: '',
    search: '',
    hash: '',
  };

  if (path) {
    const hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
      parsedPath.hash = path.slice(hashIndex);
      path = path.slice(0, hashIndex);
    }

    const searchIndex = path.indexOf('?');
    if (searchIndex >= 0) {
      parsedPath.search = path.slice(searchIndex);
      path = path.slice(0, searchIndex);
    }

    if (path) {
      parsedPath.pathname = path;
    }
  }

  return parsedPath;
}

type JsonObject = { [Key in string]: JsonValue } & {
  [Key in string]?: JsonValue | undefined;
};
type JsonArray = JsonValue[] | readonly JsonValue[];
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

type _PathParam<Path extends string> =
  // split path into individual path segments
  Path extends `${infer L}/${infer R}`
    ? _PathParam<L> | _PathParam<R>
    : Path extends `:${infer Param}`
      ? Param extends `${infer Optional}?`
        ? Optional
        : Param
      : never;

/**
 * Examples:
 * "/a/b/*" -> "*"
 * ":a" -> "a"
 * "/a/:b" -> "b"
 * "/a/blahblahblah:b" -> "b"
 * "/:a/:b" -> "a" | "b"
 * "/:a/b/:c/*" -> "a" | "c" | "*"
 */
export type PathParam<Path extends string> =
  // check if path is just a wildcard
  Path extends '*' | '/*' ? '*' : Path extends `${infer Rest}/*` ? '*' | _PathParam<Rest> : _PathParam<Path>;

export type ParamParseKey<Segment extends string> = [PathParam<Segment>] extends [never] ? string : PathParam<Segment>;

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<Key extends string = string> = {
  readonly [key in Key]?: string;
};

/**
 * Returns a path with params interpolated.
 */
export function generatePath<Path extends string>(
  originalPath: Path,
  params: {
    [key in PathParam<Path>]: string | null;
  },
): string {
  let path: string = originalPath;
  if (path.endsWith('*') && path !== '*' && !path.endsWith('/*')) {
    warning(
      false,
      `Route path "${path}" will be treated as if it were ` +
        `"${path.replace(/\*$/, '/*')}" because the \`*\` character must ` +
        `always follow a \`/\` in the pattern. To get rid of this warning, ` +
        `please change the route path to "${path.replace(/\*$/, '/*')}".`,
    );
    path = path.replace(/\*$/, '/*') as Path;
  }

  // ensure `/` is added at the beginning if the path is absolute
  const prefix = path.startsWith('/') ? '/' : '';

  const stringify = (p: any) => (p == null ? '' : typeof p === 'string' ? p : String(p));

  const segments = path
    .split(/\/+/)
    .map((segment, index, array) => {
      const isLastSegment = index === array.length - 1;

      // only apply the splat if it's the last segment
      if (isLastSegment && segment === '*') {
        const star = '*' as PathParam<Path>;
        // Apply the splat
        return stringify(params[star]);
      }

      const keyMatch = segment.match(/^:([\w-]+)(\??)$/);
      if (keyMatch) {
        const [, key, optional] = keyMatch;
        const param = params[key as PathParam<Path>];
        invariant(optional === '?' || param != null, `Missing ":${key}" param`);
        return stringify(param);
      }

      // Remove any optional markers from optional static segments
      return segment.replace(/\?$/g, '');
    })
    // Remove empty segments
    .filter((segment) => !!segment);

  return prefix + segments.join('/');
}

/**
 * A PathPattern is used to match on some portion of a URL pathname.
 */
export interface PathPattern<Path extends string = string> {
  /**
   * A string to match against a URL pathname. May contain `:id`-style segments
   * to indicate placeholders for dynamic parameters. May also end with `/*` to
   * indicate matching the rest of the URL pathname.
   */
  path: Path;
  /**
   * Should be `true` if the static portions of the `path` should be matched in
   * the same case.
   */
  sensitive?: boolean;
  /**
   * Should be `true` if this pattern should match the entire URL pathname.
   */
  strict?: boolean;
}

/**
 * A PathMatch contains info about how a PathPattern matched on a URL pathname.
 */
export interface PathMatch<ParamKey extends string = string> {
  /**
   * The names and values of dynamic parameters in the URL.
   */
  params: Params<ParamKey>;
  /**
   * The portion of the URL pathname that was matched.
   */
  pathname: string;
  /**
   * The portion of the URL pathname that was matched before child routes.
   */
  basename: string;
  /**
   * The pattern that was used to match.
   */
  pattern: PathPattern;
}

/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 */
export function matchPath<ParamKey extends ParamParseKey<Path>, Path extends string>(
  pathname: string,
  pattern: PathPattern<Path> | Path,
): PathMatch<ParamKey> | null {
  if (typeof pattern === 'string') {
    pattern = {
      path: pattern,
      sensitive: false,
      strict: true,
    };
  }

  const [matcher, compiledParams] = compilePath(pattern.path, pattern.sensitive, pattern.strict);

  const match = pathname.match(matcher);

  if (!match) {
    return null;
  }

  const captures = match.slice(1);
  const extracted = match[0];

  const matched = {
    pathname: extracted,
    basename: extracted.replace(/(.)\/+$/, '$1'),
    pattern,
    params: compiledParams.reduce<Params>((memo, { paramName }, index) => {
      const capture = captures[index] || '';
      const value = capture.replace(/%2F/g, '/');

      if (value) {
        return {
          ...memo,
          [paramName]: value,
        };
      }

      return memo;
    }, {}),
  };

  compiledParams.forEach(({ paramName }, index) => {
    if (paramName === '*') {
      const splatLength = captures[index].length ?? 0;
      matched.basename = matched.pathname.slice(0, matched.pathname.length - splatLength).replace(/(.)\/+$/, '$1');
    }
  });

  return matched;
}

type CompiledPathParam = {
  paramName: string;
};

function compilePath(path: string, sensitive = false, strict = true): [RegExp, CompiledPathParam[]] {
  const cond = path === '*' || !path.endsWith('*') || path.endsWith('/*');
  warning(
    cond,
    `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, '/*')}" because the * character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, '/*')}".`,
  );

  const params: CompiledPathParam[] = [];
  let regexp = `^${path
    .replace(/\/*\*?$/, '') // Ignore trailing / and /*, we'll handle it below
    .replace(/^\/*/, '/') // Make sure it has a leading /
    .replace(/[\\.*+^${}|()[\]]/g, '\\$&') // Escape special regex chars
    .replace(/\/:([\w-]+)(\?)?/g, (_: string, paramName: string, isOptional) => {
      params.push({ paramName });
      return isOptional ? '/?([^\\/]+)?' : '/([^\\/]+)';
    })}`;

  if (path.endsWith('*')) {
    params.push({
      paramName: '*',
    });
    if (path === '*' || path === '/*') {
      regexp += '(.*)$';
    } else {
      regexp += '(?:\\/(.+)|\\/*)$';
    }
  } else if (strict) {
    // When matching to the end, ignore trailing slashes
    regexp += '\\/*$';
  } else if (path !== '' && path !== '/') {
    // If our path is non-empty and contains anything beyond an initial slash,
    // then we have _some_ form of path in our regex, so we should expect to
    // match only if we find the end of this path segment.  Look for an optional
    // non-captured trailing slash (to match a portion of the URL) or the end
    // of the path (if we've matched to the end).  We used to do this with a
    // word boundary but that gives false positives on routes like
    // /user-preferences since `-` counts as a word boundary.
    regexp += '(?:(?=\\/|$))';
  } else {
    // Nothing to match for "" or "/"
  }

  if (sensitive) {
    const matcher = new RegExp(regexp);

    return [matcher, params];
  }

  const matcher = new RegExp(regexp, 'i');

  return [matcher, params];
}

/**
 * @private
 */
export const joinPaths = (paths: string[]): string => paths.join('/').replace(/\/\/+/g, '/');

/**
 * @private
 */
export const normalizePathname = (pathname: string): string => pathname.replace(/\/+$/, '').replace(/^\/*/, '/');

/**
 * @private
 */
export const normalizeSearch = (search: string): string =>
  !search || search === '?' ? '' : search.startsWith('?') ? search : '?' + search;

/**
 * @private
 */
export const normalizeHash = (hash: string): string =>
  !hash || hash === '#' ? '' : hash.startsWith('#') ? hash : '#' + hash;
