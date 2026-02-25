/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

/**
 * Minimal type declarations for Fabric.js 5.3.0.
 *
 * Fabric 5 uses a global namespace pattern. These declarations
 * provide the types needed for the animation editor without
 * pulling in the full (and often problematic) @types/fabric.
 */
declare namespace fabric {
  class Canvas {
    constructor(element: string | HTMLCanvasElement, options?: any);
    width: number;
    height: number;
    backgroundColor: string;
    add(...objects: Object[]): Canvas;
    remove(...objects: Object[]): Canvas;
    getObjects(): Object[];
    getActiveObject(): Object | null;
    setActiveObject(object: Object): Canvas;
    discardActiveObject(): Canvas;
    renderAll(): Canvas;
    dispose(): void;
    on(event: string, handler: (...args: any[]) => void): void;
    off(event: string, handler?: (...args: any[]) => void): void;
  }

  class Object {
    type?: string;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    opacity?: number;
    fill?: string;
    id?: string;
    set(key: string | Record<string, any>, value?: any): Object;
    get(key: string): any;
  }

  class Rect extends Object {
    constructor(options?: any);
    rx?: number;
    ry?: number;
  }

  class Circle extends Object {
    constructor(options?: any);
    radius?: number;
  }

  class Triangle extends Object {
    constructor(options?: any);
  }

  class Textbox extends Object {
    constructor(text: string, options?: any);
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
  }
}

declare module 'fabric' {
  export { fabric };
}
