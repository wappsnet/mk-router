import { ReactNode } from 'react';

export type MKHistoryListenerDto = (location: MKLocationDto) => void;

export interface MKRouteDto {
  location: MKLocationDto;
  path: string;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
  key: string;
  node: ReactNode;
}

export type MKRoutesDto = Partial<Record<string, MKRouteDto>>;

export interface MKHistoryDto<S = unknown> {
  location: MKLocationDto<S>;
  push: (path: string) => void;
  replace: (path: string) => void;
  go: (n: number) => void;
  listen: (listener: MKHistoryListenerDto) => () => void;
}

export interface MKRouteMatchDto {
  location: MKLocationDto;
  path: string;
  params: MKPathParams;
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

/**
 * The parameters that were parsed from the URL path.
 */
export type MKPathParams<Key extends string = string> = {
  [key in Key]?: string;
};
