class Node {
  constructor(definition, diagram, parsers) {
    this.type = this.getMatchingNodeIdForDefinition(definition, parsers);
    this.definition = definition;
    this.diagram = diagram;
  }

  getMatchingNodeIdForDefinition(definition, parsers) {
    return parsers
      .reduce((type, parser) => {
        return parser(definition, this.moddle) || type;
      }, null);
  }
}

export default Node;
