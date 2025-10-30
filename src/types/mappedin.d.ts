declare module '@mappedin/mappedin-js' {
  export interface MapOptions {
    container: HTMLElement;
    venue: string;
    key: string;
    backgroundColor?: string;
  }

  export class Map {
    constructor(options: MapOptions);
    on(event: string, handler: (event: any) => void): void;
    off(event: string, handler: (event: any) => void): void;
    destroy(): void;
  }
}