import { mount } from '@vue/test-utils';
import Modeler from '@/components/Modeler';
import Vue from 'vue';

describe('Modeler.vue', () => {
  it('Modeler Renders', (done) => {
    const wrapper = mount(Modeler, {sync: false});
    Vue.nextTick(() => {
      expect(wrapper.exists()).toBe(true);
      done();
    });
    // expect(wrapper).toBeDefined();
  });
});
