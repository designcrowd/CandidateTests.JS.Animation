import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AnimationItem from '@/components/animation/animationItem.vue';
import type { AnimationDefinition } from '@/constants/animations';

const fadeAnimation: AnimationDefinition = {
  type: 'fade',
  label: 'Fade In',
};

describe('AnimationItem', () => {
  it('renders the animation label', () => {
    const wrapper = mount(AnimationItem, {
      props: { animation: fadeAnimation, isSelected: false },
    });

    expect(wrapper.text()).toBe('Fade In');
  });

  it('emits select with the animation type when clicked', async () => {
    const wrapper = mount(AnimationItem, {
      props: { animation: fadeAnimation, isSelected: false },
    });

    await wrapper.trigger('click');

    expect(wrapper.emitted('select')).toEqual([['fade']]);
  });

  it('applies selected styles when isSelected is true', () => {
    const wrapper = mount(AnimationItem, {
      props: { animation: fadeAnimation, isSelected: true },
    });

    expect(wrapper.classes()).toContain('border-indigo-500');
  });

  it('does not apply selected styles when isSelected is false', () => {
    const wrapper = mount(AnimationItem, {
      props: { animation: fadeAnimation, isSelected: false },
    });

    expect(wrapper.classes()).not.toContain('border-indigo-500');
  });
});
