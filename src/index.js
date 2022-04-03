const { runInNewContext } = require('vm');
const { transform } = require('./transform');

function compileExpression(expression, scope) {
  if (expression == null) {
    return null;
  }
  const code = transform(expression);
  return runInNewContext(code, scope || {});
}

module.exports = {
  transform,
  compileExpression,
};
