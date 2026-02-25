import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PlayButton from '@/components/playButton.vue';

describe('PlayButton', () => {
  it('renders play icon when not playing', () => {
    const wrapper = mount(PlayButton, {
      props: { isPlaying: false },
    });

    expect(wrapper.find('svg path').exists()).toBe(true);
    expect(wrapper.find('svg rect').exists()).toBe(false);
    expect(wrapper.attributes('title')).toBe('Play');
  });

  it('renders stop icon when playing', () => {
    const wrapper = mount(PlayButton, {
      props: { isPlaying: true },
    });

    expect(wrapper.find('svg rect').exists()).toBe(true);
    expect(wrapper.find('svg path').exists()).toBe(false);
    expect(wrapper.attributes('title')).toBe('Stop');
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(PlayButton, {
      props: { isPlaying: false },
    });

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('applies playing styles when isPlaying is true', () => {
    const wrapper = mount(PlayButton, {
      props: { isPlaying: true },
    });

    expect(wrapper.classes()).toContain('border-red-300');
  });

  it('applies default styles when not playing', () => {
    const wrapper = mount(PlayButton, {
      props: { isPlaying: false },
    });

    expect(wrapper.classes()).toContain('border-slate-200');
  });
});
