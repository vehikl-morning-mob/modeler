<template>
  <div class="paper">
    <div ref="paper" />
    <slot />
  </div>
</template>

<script>
import joint from 'jointjs';
import { highlightPadding } from '@/mixins/crownConfig';

export default {
  provide() {
    const jointData = {};

    Object.defineProperty(jointData, 'graph', {
      enumerable: true,
      get: () => this.graph,
    });

    Object.defineProperty(jointData, 'paper', {
      enumerable: true,
      get: () => this.paper,
    });

    return { jointData };
  },
  data() {
    return {
      graph: null,
      paper: null,
      canvasDragPosition: null,
    };
  },
  methods: {
    panToMouse(event) {
      this.paper.translate(
        event.offsetX - this.canvasDragPosition.x,
        event.offsetY - this.canvasDragPosition.y
      );
    },
  },
  mounted() {
    this.graph = new joint.dia.Graph();

    this.graph.set('interactiveFunc', cellView => {
      return {
        elementMove: cellView.model.get('elementMove'),
      };
    });

    this.paper = new joint.dia.Paper({
      el: this.$refs.paper,
      model: this.graph,
      gridSize: 10,
      width: '100%',
      height: '100%',
      drawGrid: true,
      clickThreshold: 10,
      perpendicularLinks: true,
      interactive: this.graph.get('interactiveFunc'),
      highlighting: {
        default: { options: { padding: highlightPadding } },
      },
    });

    this.paper.on('blank:pointerdown', (event, x, y) => {
      this.canvasDragPosition = { x, y };
      this.$el.addEventListener('mousemove', this.panToMouse);
    });

    this.paper.on('cell:pointerup blank:pointerup', () => {
      this.$el.removeEventListener('mousemove', this.panToMouse);
    });
  },
};
</script>

<style scoped>
.paper {
  height: 100%;
}
</style>
