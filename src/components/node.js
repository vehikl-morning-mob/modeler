class Node {
  constructor(definition, diagram, parsers, moddle) {
    this.type = this.getMatchingNodeIdForDefinition(definition, parsers);
    this.definition = definition;
    this.diagram = diagram;
    this.moddle = moddle;

    if (this.nameIsRequiredAndNotPresent()) {
      this.definition.set('name', '');
    }
  }

  getMatchingNodeIdForDefinition(definition, parsers) {
    return parsers
      .reduce((type, parser) => {
        return parser(definition, this.moddle) || type;
      }, null);
  }
  nameIsRequiredAndNotPresent() {
    return this.requiresName() && !this.definition.get('name');
  }

  requiresName() {
    return this.definition.$type !== 'bpmn:TextAnnotation';
  }
}

export default Node;
