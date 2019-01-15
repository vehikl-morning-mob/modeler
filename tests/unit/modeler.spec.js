import { mount } from '@vue/test-utils';
import Modeler from '@/components/Modeler';

describe('Modeler.vue', () => {
  it('Modeler Renders', () => {
    const wrapper = mount(Modeler);
    expect(wrapper.exists()).toBe(true);
  });
});
