import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AnimationSettings from '@/components/animation/animationSettings.vue';
import { ANIMATIONS } from '@/constants/animations';

describe('AnimationSettings', () => {
  it('renders all animation options', () => {
    const wrapper = mount(AnimationSettings, {
      props: { selectedType: 'none' },
    });

    const buttons = wrapper.findAll('button');

    expect(buttons.length).toBe(ANIMATIONS.length);
  });

  it('renders animation labels', () => {
    const wrapper = mount(AnimationSettings, {
      props: { selectedType: 'none' },
    });

    for (const anim of ANIMATIONS) {
      expect(wrapper.text()).toContain(anim.label);
    }
  });

  it('emits animationChanged when an animation is selected', async () => {
    const wrapper = mount(AnimationSettings, {
      props: { selectedType: 'none' },
    });

    const buttons = wrapper.findAll('button');
    const fadeButton = buttons.find((b) => b.text() === 'Fade In');

    await fadeButton!.trigger('click');

    expect(wrapper.emitted('animationChanged')).toEqual([['fade']]);
  });

  it('marks the selected animation', () => {
    const wrapper = mount(AnimationSettings, {
      props: { selectedType: 'fade' },
    });

    const buttons = wrapper.findAll('button');
    const fadeButton = buttons.find((b) => b.text() === 'Fade In');

    expect(fadeButton!.classes()).toContain('border-indigo-500');
  });
});
