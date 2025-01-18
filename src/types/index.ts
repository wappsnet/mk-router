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
