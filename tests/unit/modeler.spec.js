import { mount } from '@vue/test-utils';
import Modeler from '@/components/Modeler';

describe('Modeler.vue', () =>{
  const wrapper = mount(Modeler);
  it('Modeler Reneders', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
