export type MKHistoryListenerDto = (location: Location) => void;

export interface MKHistoryDto<S = unknown> {
  location: MKLocationDto<S>;
  push: (path: string) => void;
  replace: (path: string) => void;
  go: (n: number) => void;
  listen: (listener: MKHistoryListenerDto) => () => void;
}

export interface MKRouteMatchDto {
  history: MKHistoryDto;
  location: MKLocationDto;
  path: string;
  params: Record<string, string>;
  index?: number;
}

export interface MKPathDto {
  pathname: string;
  search?: string;
  hash?: string;
}

export interface MKLocationDto<State = unknown> extends MKPathDto {
  state?: State;
  key?: string;
}

export type MKToDto = string | Partial<MKPathDto>;

export interface MKRouterStaticContext {
  statusCode?: number;
}

export interface MKMatchDto<Params extends { [K in keyof Params]?: string } = Partial<Record<string, string>>> {
  params: Params;
  isExact: boolean;
  path: string;
  url: string;
}

export interface RouteComponentProps<
  Params extends { [K in keyof Params]?: string } = Partial<Record<string, string>>,
  C extends MKRouterStaticContext = MKRouterStaticContext,
  S = unknown,
> {
  history: MKHistoryDto<S>;
  location: MKLocationDto<S>;
  match: MKMatchDto<Params>;
  staticContext?: C | undefined;
}
