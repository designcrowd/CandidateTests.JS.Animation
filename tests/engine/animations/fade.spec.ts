import { describe, it, expect } from 'vitest';
import { buildFadeAnimation } from '@/engine/animations/fade';

const createMockObject = (opacity = 1): fabric.Object =>
  ({
    id: 'test-obj',
    opacity,
  }) as fabric.Object;

describe('buildFadeAnimation', () => {
  it('returns a track with correct metadata', () => {
    const obj = createMockObject();
    const track = buildFadeAnimation(obj, 2000);

    expect(track.objectId).toBe('test-obj');
    expect(track.type).toBe('fade');
    expect(track.duration).toBe(2000);
    expect(track.object).toBe(obj);
  });

  it('apply sets opacity to the progress value', () => {
    const obj = createMockObject(1);
    const track = buildFadeAnimation(obj, 1000);

    track.apply(0);
    expect(obj.opacity).toBe(0);

    track.apply(0.5);
    expect(obj.opacity).toBe(0.5);

    track.apply(1);
    expect(obj.opacity).toBe(1);
  });

  it('restore resets opacity to the original value', () => {
    const obj = createMockObject(0.8);
    const track = buildFadeAnimation(obj, 1000);

    track.apply(0);
    expect(obj.opacity).toBe(0);

    track.restore();
    expect(obj.opacity).toBe(0.8);
  });

  it('handles undefined opacity as 1', () => {
    const obj = { id: 'no-opacity' } as fabric.Object;
    const track = buildFadeAnimation(obj, 1000);

    track.apply(0);
    track.restore();

    expect(obj.opacity).toBe(1);
  });

  it('handles undefined id as empty string', () => {
    const obj = { opacity: 1 } as fabric.Object;
    const track = buildFadeAnimation(obj, 1000);

    expect(track.objectId).toBe('');
  });
});
