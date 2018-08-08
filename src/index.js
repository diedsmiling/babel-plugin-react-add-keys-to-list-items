const uniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

module.exports = function({ types: t }) {
  const getIndexVariableName = path => {
    let isVarialbeUnique = false;
    let variable = '';

    while (!isVarialbeUnique) {
      variable = uniqueId();

      path.traverse({
        Identifier(path) {
          isVarialbeUnique = path.node.name !== this.variable;
        }
      }, { variable });
    }

    return variable
  };

  const MapVisitor = {
    JSXElement(path) {
      if (!path.parentPath.isJSXElement()) { // we should not consider children components
        const attrs = path.node.openingElement.attributes;
        const hasKeyAttribute = attrs.length > 0 && attrs.every((node) => node.name.name === 'key')

        if (attrs.length > 0 || !hasKeyAttribute) {
          const expression = t.binaryExpression("+", t.Identifier(this.indexVar), t.stringLiteral('_key'))

          path.node.openingElement.attributes.push(
            t.jSXAttribute(t.jSXIdentifier('key'), t.JSXExpressionContainer(expression))
          );
        }
      }
    }
  };

  return {
    visitor: {
      CallExpression: function(path, state) {
        const callee = path.get("callee");
        if (!callee.isMemberExpression() || callee.node.property.name !== 'map') return;
        // we need to be sure that argument is an anonymous function or seek for declared function

        const params = path.get("arguments")[0].get('params');
        let indexVar = '';

        if (params.length === 1) {
          // we need to be sure that newly generated variable name isn't an Identifier from map() body
          indexVar = getIndexVariableName(path.get("arguments")[0])
          path.get("arguments")[0].node.params.push(t.Identifier(indexVar))
        } else {
          indexVar = params[1].node.name;
        }
        path.traverse(MapVisitor, { indexVar })
      }
    }
  }
};
