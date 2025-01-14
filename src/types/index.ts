export type MKHistoryListenerDto = (location: Location) => void;

export interface MKHistoryDto {
  location: Location;
  push: (path: string) => void;
  replace: (path: string) => void;
  go: (n: number) => void;
  listen: (listener: MKHistoryListenerDto) => () => void;
}
