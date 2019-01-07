<template>
  <div />
</template>

<script>
export default {
  inject: ['jointData'],
  props: {
    type: { type: Function, required: true },
    attrs: { type: Object, required: true },
    position: { type: Object, default: () => ({ x: 0, y: 0 }) },
    size: { type: Object, default: () => ({ width: 50, height: 50 }) },
    label: { type: String, default: '' },
  },
  data() {
    return {
      graph: this.jointData.graph,
      paper: this.jointData.paper,
      shape: null,
    };
  },
  watch: {
    label(label) {
      this.shape.attr('label/text', label);
    },
  },
  mounted() {
    this.shape = new this.type({
      attrs: this.attrs,
      position: this.position,
      size: this.size,
    });

    this.shape.attr('label/text', this.label);

    this.shape.addTo(this.graph);

    this.shape.listenTo(this.paper, 'blank:pointerdown cell:pointerdown', cellView => {
      if (cellView.model === this.shape) {
        cellView.highlight();
        cellView.model.toFront();
        this.$emit('highlight', true);
      } else {
        this.shape.findView(this.paper).unhighlight();
        this.$emit('highlight', false);
      }
    });
  },
};
</script>
