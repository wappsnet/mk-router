export type MKHistoryListenerDto = (location: Location) => void;

export interface MKHistoryDto {
  location: Location;
  push: (path: string) => void;
  replace: (path: string) => void;
  go: (n: number) => void;
  listen: (listener: MKHistoryListenerDto) => () => void;
}

export interface MKRouteMatchDto {
  path: string;
  params: Record<string, string>;
}

export interface MKPathDto {
  pathname: string;
  search: string;
  hash: string;
}

export interface MKLocationDto<State = any> extends MKPathDto {
  state: State;
  key: string;
}

export type MKToDto = string | Partial<MKPathDto>;
