import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Sidebar from '@/components/sidebar.vue';

describe('Sidebar', () => {
  it('shows animation settings when an object is selected', () => {
    const wrapper = mount(Sidebar, {
      props: {
        selectedObjectId: 'obj-1',
        selectedAnimationType: 'none',
      },
    });

    expect(wrapper.text()).toContain('Animation');
  });

  it('shows placeholder when no object is selected', () => {
    const wrapper = mount(Sidebar, {
      props: {
        selectedObjectId: null,
        selectedAnimationType: 'none',
      },
    });

    expect(wrapper.text()).toContain('Select an object');
  });

  it('emits animationChanged when animation is selected', async () => {
    const wrapper = mount(Sidebar, {
      props: {
        selectedObjectId: 'obj-1',
        selectedAnimationType: 'none',
      },
    });

    const fadeButton = wrapper
      .findAll('button')
      .find((b) => b.text() === 'Fade In');

    await fadeButton!.trigger('click');

    expect(wrapper.emitted('animationChanged')).toEqual([['fade']]);
  });
});
