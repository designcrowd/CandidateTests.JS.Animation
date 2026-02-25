import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Timeline, TimelineState } from '@/engine/timeline';
import type { AnimationTrack } from '@/engine/tracks';

const createMockCanvas = () =>
  ({
    renderAll: vi.fn(),
  }) as unknown as fabric.Canvas;

const createMockTrack = (
  overrides: Partial<AnimationTrack> = {},
): AnimationTrack => ({
  object: {} as fabric.Object,
  objectId: overrides.objectId ?? 'obj-1',
  type: 'fade',
  duration: overrides.duration ?? 1000,
  apply: vi.fn(),
  restore: vi.fn(),
  ...overrides,
});

describe('Timeline', () => {
  let timeline: Timeline;
  let canvas: ReturnType<typeof createMockCanvas>;
  let now: number;
  let rafCallbacks: Map<number, FrameRequestCallback>;
  let rafId: number;

  beforeEach(() => {
    canvas = createMockCanvas();
    timeline = new Timeline(canvas);

    // Mock performance.now
    now = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => now);

    // Mock requestAnimationFrame / cancelAnimationFrame
    rafCallbacks = new Map();
    rafId = 0;

    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      rafId += 1;
      rafCallbacks.set(rafId, cb);

      return rafId;
    });

    vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation((id) => {
      rafCallbacks.delete(id);
    });
  });

  afterEach(() => {
    timeline.stop();
    vi.restoreAllMocks();
  });

  /** Simulate one animation frame at the given time. */
  const advanceTo = (ms: number): void => {
    now = ms;

    const callbacks = [...rafCallbacks.values()];

    rafCallbacks.clear();

    for (const cb of callbacks) {
      cb(ms);
    }
  };

  // --------------------------------------------------------------------
  // Initial state
  // --------------------------------------------------------------------
  describe('initial state', () => {
    it('is not playing', () => {
      expect(timeline.isPlaying).toBe(false);
    });

    it('has no tracks', () => {
      expect(timeline.hasTracks()).toBe(false);
    });

    it('has zero duration', () => {
      expect(timeline.duration).toBe(0);
    });
  });

  // --------------------------------------------------------------------
  // Track management
  // --------------------------------------------------------------------
  describe('track management', () => {
    it('adds a track', () => {
      timeline.addTrack(createMockTrack());
      expect(timeline.hasTracks()).toBe(true);
    });

    it('replaces an existing track for the same object', () => {
      const track1 = createMockTrack({ duration: 500 });
      const track2 = createMockTrack({ duration: 2000 });

      timeline.addTrack(track1);
      timeline.addTrack(track2);

      expect(timeline.duration).toBe(2000);
      expect(track1.restore).toHaveBeenCalled();
    });

    it('removes a track by object ID and restores it', () => {
      const track = createMockTrack({ objectId: 'obj-1' });

      timeline.addTrack(track);
      timeline.removeTrack('obj-1');

      expect(timeline.hasTracks()).toBe(false);
      expect(track.restore).toHaveBeenCalled();
    });

    it('does nothing when removing a non-existent track', () => {
      timeline.removeTrack('does-not-exist');
      expect(timeline.hasTracks()).toBe(false);
    });

    it('reports duration of the longest track', () => {
      timeline.addTrack(createMockTrack({ objectId: 'a', duration: 500 }));
      timeline.addTrack(createMockTrack({ objectId: 'b', duration: 2000 }));
      timeline.addTrack(createMockTrack({ objectId: 'c', duration: 1000 }));

      expect(timeline.duration).toBe(2000);
    });
  });

  // --------------------------------------------------------------------
  // Playback
  // --------------------------------------------------------------------
  describe('playback', () => {
    it('start() sets isPlaying to true', () => {
      timeline.addTrack(createMockTrack());
      timeline.start();

      expect(timeline.isPlaying).toBe(true);
    });

    it('stop() sets isPlaying to false and restores tracks', () => {
      const track = createMockTrack();

      timeline.addTrack(track);
      timeline.start();
      timeline.stop();

      expect(timeline.isPlaying).toBe(false);
      expect(track.restore).toHaveBeenCalled();
      expect(canvas.renderAll).toHaveBeenCalled();
    });

    it('tick calls apply with progress based on elapsed time', () => {
      const track = createMockTrack({ duration: 1000 });

      timeline.addTrack(track);

      now = 0;
      timeline.start();

      // Advance to 500ms — halfway through the 1000ms track
      advanceTo(500);

      expect(track.apply).toHaveBeenCalled();

      const lastCall = (track.apply as ReturnType<typeof vi.fn>).mock.calls;
      const lastProgress = lastCall[lastCall.length - 1][0];

      expect(lastProgress).toBeCloseTo(0.5, 1);
    });

    it('auto-stops and restores when duration is exceeded', () => {
      const track = createMockTrack({ duration: 1000 });

      timeline.addTrack(track);

      now = 0;
      timeline.start();

      // Jump past the duration
      advanceTo(1100);

      expect(timeline.isPlaying).toBe(false);
      expect(track.restore).toHaveBeenCalled();
    });

    it('clamps progress to 1 for shorter tracks', () => {
      const shortTrack = createMockTrack({
        objectId: 'short',
        duration: 500,
      });

      const longTrack = createMockTrack({
        objectId: 'long',
        duration: 1000,
      });

      timeline.addTrack(shortTrack);
      timeline.addTrack(longTrack);

      now = 0;
      timeline.start();

      // At 700ms, the short track (500ms) should be clamped to 1
      advanceTo(700);

      const shortCalls = (shortTrack.apply as ReturnType<typeof vi.fn>).mock
        .calls;
      const lastShortProgress = shortCalls[shortCalls.length - 1][0];

      expect(lastShortProgress).toBe(1);
    });

    it('start() resets playback from the beginning', () => {
      const track = createMockTrack({ duration: 1000 });

      timeline.addTrack(track);

      now = 0;
      timeline.start();

      advanceTo(500);

      // Restart at time 1000
      now = 1000;
      timeline.start();

      expect(timeline.isPlaying).toBe(true);

      // Advance 200ms from restart — should be at ~0.2 progress
      advanceTo(1200);

      const calls = (track.apply as ReturnType<typeof vi.fn>).mock.calls;
      const lastProgress = calls[calls.length - 1][0];

      expect(lastProgress).toBeCloseTo(0.2, 1);
    });

    it('renders canvas each frame', () => {
      timeline.addTrack(createMockTrack({ duration: 1000 }));

      now = 0;
      timeline.start();

      (canvas.renderAll as ReturnType<typeof vi.fn>).mockClear();
      advanceTo(100);

      expect(canvas.renderAll).toHaveBeenCalled();
    });

    it('schedules the next frame via requestAnimationFrame', () => {
      timeline.addTrack(createMockTrack({ duration: 1000 }));

      now = 0;
      timeline.start();

      // start() calls tick() which schedules the next frame
      expect(requestAnimationFrame).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------
  // State change callback
  // --------------------------------------------------------------------
  describe('onStateChange callback', () => {
    it('fires with Playing on start', () => {
      const callback = vi.fn();

      timeline.setOnStateChange(callback);
      timeline.addTrack(createMockTrack());
      timeline.start();

      expect(callback).toHaveBeenCalledWith(TimelineState.Playing);
    });

    it('fires with Stopped on stop', () => {
      const callback = vi.fn();

      timeline.setOnStateChange(callback);
      timeline.addTrack(createMockTrack());
      timeline.start();

      callback.mockClear();
      timeline.stop();

      expect(callback).toHaveBeenCalledWith(TimelineState.Stopped);
    });

    it('fires with Stopped when animation completes', () => {
      const callback = vi.fn();

      timeline.setOnStateChange(callback);
      timeline.addTrack(createMockTrack({ duration: 1000 }));

      now = 0;
      timeline.start();

      callback.mockClear();

      advanceTo(1100);

      expect(callback).toHaveBeenCalledWith(TimelineState.Stopped);
    });

    it('does not fire Stopped when already stopped', () => {
      const callback = vi.fn();

      timeline.setOnStateChange(callback);
      timeline.stop();

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
