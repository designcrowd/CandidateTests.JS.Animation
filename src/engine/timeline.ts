import type { AnimationTrack } from './tracks';

export enum TimelineState {
  Stopped = 'stopped',
  Playing = 'playing',
}

export class Timeline {
  private tracks: AnimationTrack[] = [];
  private canvas: fabric.Canvas | null = null;

  private startTime = 0;
  private rafId: number | null = null;

  private state: TimelineState = TimelineState.Stopped;
  private onStateChange: ((state: TimelineState) => void) | null = null;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  setOnStateChange(callback: (state: TimelineState) => void): void {
    this.onStateChange = callback;
  }

  hasTracks(): boolean {
    return this.tracks.length > 0;
  }

  get duration(): number {
    if (this.tracks.length === 0) {
      return 0;
    }

    return Math.max(...this.tracks.map((t) => t.duration));
  }

  get isPlaying(): boolean {
    return this.state === TimelineState.Playing;
  }

  addTrack(track: AnimationTrack): void {
    this.removeTrack(track.objectId);
    this.tracks.push(track);
  }

  removeTrack(objectId: string): void {
    const idx = this.tracks.findIndex((t) => t.objectId === objectId);

    if (idx !== -1) {
      const track = this.tracks[idx];

      track.restore();
      this.tracks.splice(idx, 1);
    }
  }

  start(): void {
    this.stopInternal(false);
    this.state = TimelineState.Playing;
    this.onStateChange?.(this.state);
    this.startTime = performance.now();
    this.tick();
  }

  stop(): void {
    this.stopInternal(true);
  }

  private stopInternal(restore: boolean): void {
    const wasPlaying = this.state === TimelineState.Playing;

    this.state = TimelineState.Stopped;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (restore) {
      for (const track of this.tracks) {
        track.restore();
      }

      this.canvas?.renderAll();
    }

    if (wasPlaying) {
      this.onStateChange?.(this.state);
    }
  }

  private tick = (): void => {
    if (this.state !== TimelineState.Playing || !this.canvas) {
      return;
    }

    const elapsed = performance.now() - this.startTime;
    const totalDuration = this.duration;

    if (elapsed >= totalDuration) {
      this.stopInternal(true);

      return;
    }

    for (const track of this.tracks) {
      const progress = Math.min(elapsed / track.duration, 1);

      track.apply(progress);
    }

    this.canvas.renderAll();
    this.rafId = requestAnimationFrame(this.tick);
  };
}
