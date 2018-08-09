module.exports = function addListKeyd({types: t}) {
  const MapVisitor = {
    JSXElement(path) {
      // We should not consider children components
      if (!path.parentPath.isJSXElement()) {
        const attrs = path.node.openingElement.attributes
        const hasKeyAttribute = (
          attrs.length > 0 && attrs.every(node => node.name.name === "key")
        )

        if (attrs.length > 0 || !hasKeyAttribute) {
          const expression = t.binaryExpression(
            "+", t.stringLiteral("key::"), t.Identifier(this.indexVar)
          )

          path.node.openingElement.attributes.push(
            t.jSXAttribute(
              t.jSXIdentifier("key"),
              t.JSXExpressionContainer(expression)
            )
          )
        }
      }
    }
  }

  return {
    visitor: {
      CallExpression(path) {
        const callee = path.get("callee")
        if (
          !callee.isMemberExpression() || callee.node.property.name !== "map"
        ) {
          return undefined
        }

        const params = path.get("arguments")[0].get("params")
        if (params.length > 1) {
          const indexVar = params[1].node.name

          return void path.traverse(MapVisitor, {indexVar})
        }

        // We need to be sure that argument is an anonymous function
        // or seek for declared function
        const [argument] = path.get("arguments")
        const indexVar = argument.scope.generateUid("key")

        argument.node.params.push(t.Identifier(indexVar))

        return void path.traverse(MapVisitor, {indexVar})
      }
    }
  }
}
