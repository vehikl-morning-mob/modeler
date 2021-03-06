import joint from 'jointjs';
import pull from 'lodash/pull';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { validNodeColor, invalidNodeColor, defaultNodeColor } from '@/components/nodeColors';

export default {
  data() {
    return {
      sourceShape: null,
      target: null,
      anchorPadding: 25,
    };
  },
  watch: {
    target(target, previousTarget) {
      if (previousTarget && previousTarget !== target) {
        this.setBodyColor(defaultNodeColor, previousTarget);
      }
    },
    isValidConnection(isValid) {
      if (isValid) {
        this.shape.stopListening(this.paper, 'blank:pointerdown link:pointerdown element:pointerdown', this.removeLink);
      } else {
        this.shape.listenToOnce(this.paper, 'blank:pointerdown link:pointerdown element:pointerdown', this.removeLink);
      }
    },
  },
  computed: {
    sourceNode() {
      return get(this.sourceShape, 'component.node');
    },
    targetNode() {
      return get(this.target, 'component.node');
    },
    sourceConfig() {
      return this.sourceNode && this.nodeRegistry[this.sourceNode.type];
    },
    targetConfig() {
      return this.targetNode && this.nodeRegistry[this.targetNode.type];
    },
    elementPadding() {
      return this.shape && this.shape.source().id === this.shape.target().id ? 20 : 1;
    },
  },
  methods: {
    setBodyColor(color, target = this.target) {
      target.attr('body/fill', color);
      target.attr('.body/fill', color);
    },
    completeLink() {
      this.shape.stopListening(this.paper, 'cell:mouseleave');
      this.$emit('set-cursor', null);

      this.resetPaper();

      this.updateWaypoints();

      const targetShape = this.shape.getTargetElement();
      this.setBodyColor(defaultNodeColor, targetShape);

      this.shape.listenTo(this.sourceShape, 'change:position', this.updateWaypoints);
      this.shape.listenTo(targetShape, 'change:position', this.updateWaypoints);
    },
    updateWaypoints() {
      const connections = this.shape.findView(this.paper).getConnection();
      const points = connections.segments.map(segment => segment.end);

      this.node.diagram.waypoint = points.map(point => this.moddle.create('dc:Point', point));
      this.updateCrownPosition();
    },
    updateLinkTarget({ clientX, clientY }) {
      const localMousePosition = this.paper.clientToLocalPoint({ x: clientX, y: clientY });

      /* Sort shapes by z-index descending; grab the shape on top (with the highest z-index) */
      this.target = this.graph.findModelsFromPoint(localMousePosition).sort((shape1, shape2) => {
        return shape2.get('z') - shape1.get('z');
      })[0];

      if (!this.isValidConnection) {
        this.$emit('set-cursor', 'not-allowed');

        this.shape.target({
          x: localMousePosition.x,
          y: localMousePosition.y,
        });

        if (this.target) {
          this.setBodyColor(invalidNodeColor);
        }

        return;
      }

      this.shape.target(this.target, {
        anchor: {
          name: this.target instanceof joint.shapes.standard.Rectangle ? 'perpendicular' : 'modelCenter',
          args: { padding: this.anchorPadding },
        },
        connectionPoint: { name: 'boundary' },
      });

      this.updateRouter();

      this.$emit('set-cursor', 'default');
      this.setBodyColor(validNodeColor);

      this.paper.el.removeEventListener('mousemove', this.updateLinkTarget);
      this.shape.listenToOnce(this.paper, 'cell:pointerclick', () => {
        this.completeLink();
        this.updateDefinitionLinks();
        this.$emit('save-state');
      });

      this.shape.listenToOnce(this.paper, 'cell:mouseleave', () => {
        this.paper.el.addEventListener('mousemove', this.updateLinkTarget);
        this.shape.stopListening(this.paper, 'cell:pointerclick');
        this.setBodyColor(defaultNodeColor);
        this.$emit('set-cursor', 'not-allowed');
      });
    },
    removeLink() {
      this.$emit('remove-node', this.node);
      this.resetPaper();
    },
    resetPaper() {
      this.$emit('set-cursor', null);
      this.paper.el.removeEventListener('mousemove', this.updateLinkTarget);
      this.paper.setInteractivity(this.graph.get('interactiveFunc'));

      if (this.target) {
        this.setBodyColor(defaultNodeColor);
      }
    },
  },
  created() {
    this.updateWaypoints = debounce(this.updateWaypoints, 100);
  },
  async mounted() {
    await this.$nextTick();
    /* Use nextTick to ensure this code runs after the component it is mixed into mounts.
     * This will ensure this.shape is defined. */

    this.sourceShape = this.graph.getElements().find(element => {
      return element.component && element.component.node.definition === this.node.definition.get('sourceRef');
    });

    this.shape.source(this.sourceShape, {
      anchor: { name: 'modelCenter' },
      connectionPoint: { name: 'boundary' },
    });

    this.sourceShape.embed(this.shape);

    this.shape.addTo(this.graph);
    this.shape.component = this;

    const targetRef = this.node.definition.get('targetRef');

    if (targetRef.id) {
      const targetShape = this.graph.getElements().find(element => {
        return element.component && element.component.node.definition === targetRef;
      });

      this.shape.target(targetShape, {
        anchor: {
          name: targetShape instanceof joint.shapes.standard.Rectangle ? 'perpendicular' : 'modelCenter',
          args: { padding: this.anchorPadding },
        },
        connectionPoint: { name: 'boundary' },
      });

      this.completeLink();
    } else {
      this.shape.target(targetRef, {
        connectionPoint: { name: 'boundary' },
      });

      this.paper.setInteractivity(false);
      this.paper.el.addEventListener('mousemove', this.updateLinkTarget);

      this.$emit('set-cursor', 'not-allowed');

      if (this.isValidConnection) {
        this.shape.stopListening(this.paper, 'blank:pointerdown link:pointerdown element:pointerdown', this.removeLink);
      } else {
        this.shape.listenToOnce(this.paper, 'blank:pointerdown link:pointerdown element:pointerdown', this.removeLink);
      }
    }

    this.updateRouter();
  },
  destroyed() {
    /* Modify source and target refs to remove incoming and outgoing properties pointing to this link */
    const { sourceRef, targetRef } = this.node.definition;
    if (sourceRef) {
      pull(sourceRef.get('outgoing'), this.node.definition);
    }

    /* If targetRef is defined, it could be a point or another element.
     * If targetRef has an id, that means it's an element and the reference to it
     * can be safely removed. */
    if (targetRef.id) {
      pull(targetRef.get('incoming'), this.node.definition);
    }

    this.updateWaypoints.cancel();
  },
};
