const uniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

module.exports = function({ types: t }) {
  const MapVisitor = {
    JSXElement(path) {
      if (!path.parentPath.isJSXElement()) { // we should not consider children components
        const attrs = path.node.openingElement.attributes;
        const hasKeyAttribute = attrs.length > 0 && attrs.every((node) => node.name.name === 'key')
        if (attrs.length > 0 || !hasKeyAttribute) {
          path.node.openingElement.attributes.push(
            t.jSXAttribute(t.jSXIdentifier('key'), t.stringLiteral(uniqueId()))
          );
        }
      }
    }
  };

  return {
    visitor: {
      CallExpression: function(path, scope) {
        const callee = path.get("callee");
        if (!callee.isMemberExpression() || callee.node.property.name !== 'map') return;
        path.traverse(MapVisitor)
      }
    }
  }
};
