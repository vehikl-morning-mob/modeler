<template>
  <div>
    <Shape
      @highlight="highlighted = $event"
      :type="config.shape"
      :attrs="config.attrs"
      :position="position"
      :size="size"
      :label="name"
    />

    <portal v-if="highlighted" to="inspector-panel">
      <vue-form-renderer
        :data="inspectorData"
        @update="updateElementProperties"
        :config="config.inspectorConfig"
      />
    </portal>
  </div>
</template>

<script>
import { Shape } from '@/components/jointjs-vue';
import debounce from 'lodash/debounce';
import store, { saveDebounce } from '@/store';

export default {
  components: { Shape },
  props: {
    element: { type: Object, required: true },
    nodeRegistry: { type: Object, required: true },
    parsers: { type: Object, required: true },
  },
  data() {
    return {
      highlighted: false,
    };
  },
  methods: {
    updateElementProperties(value) {
      for (const key in value) {
        if (this.element.bpmnElement.get(key) !== value[key]) {
          this.setElementProp(this.element, key, value[key]);
        }
      }
    },
    setElementProp: debounce(function(element, key, value) {
      store.dispatch('updateElementProp', { element, key, value });
    }, saveDebounce),
  },
  computed: {
    config() {
      const bpmnType = this.element.bpmnElement.$type;
      const configId = this.parsers[bpmnType].reduce((type, parser) => {
        return parser(this.element) || type;
      }, null);

      if (!configId) {
        throw new Error(`Unsupported element type in parse: ${bpmnType}`);
      }

      return this.nodeRegistry[configId];
    },
    position() {
      const { x, y } = this.element.bounds;
      return { x, y };
    },
    size() {
      const { width, height } = this.element.bounds;
      return { width, height };
    },
    name() {
      return this.element.bpmnElement.name;
    },
    inspectorData() {
      return Object.entries(this.element.bpmnElement).reduce((data, [key, value]) => {
        data[key] = value;
        return data;
      }, {});
    },
  },
};
</script>

<style>
.name-prop {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
}
</style>
