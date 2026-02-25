import { describe, it, expect } from 'vitest';
import { buildAnimationTrack } from '@/engine/tracks';

const createMockObject = (): fabric.Object =>
  ({
    id: 'test-obj',
    opacity: 1,
  }) as fabric.Object;

describe('buildAnimationTrack', () => {
  it('builds a fade track', () => {
    const obj = createMockObject();
    const track = buildAnimationTrack(obj, 'fade', 2000);

    expect(track).not.toBeNull();
    expect(track!.type).toBe('fade');
    expect(track!.duration).toBe(2000);
    expect(track!.objectId).toBe('test-obj');
  });

  it('returns null for "none" type', () => {
    const track = buildAnimationTrack(createMockObject(), 'none', 1000);

    expect(track).toBeNull();
  });

  it('returns null for an unknown type', () => {
    const track = buildAnimationTrack(
      createMockObject(),
      'unknown' as never,
      1000,
    );

    expect(track).toBeNull();
  });
});
