const { transform } = require('./transform');

function compileExpression(expression, scope) {
  if (expression == null) {
    return null;
  }
  const code = transform(expression);
  return new Function('__scope__', `with(__scope__ || {}) { return ${code} }`)(
    scope
  );
}

module.exports = {
  transform,
  compileExpression,
};
