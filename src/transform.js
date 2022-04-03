const acornWalk = require('acorn-walk');
const acornJSX = require('acorn-jsx');
const { generate } = require('astring');
const Parser = require('acorn').Parser.extend(acornJSX());

const noop = () => {};

Object.assign(acornWalk.base, {
  JSXElement: noop,
  JSXFragment: noop,
  // JSXOpeningElement: noop,
  // JSXClosingElement: noop,
  // JSXOpeningFragment: noop,
  // JSXClosingFragment: noop,
  // JSXExpressionContainer: noop,
  // JSXSpreadAttribute: noop,
  // JSXAttribute: noop,
  // JSXMemberExpression: noop,
  // JSXIdentifier: noop,
  // JSXEmptyExpression: noop,
  // JSXText: noop,
  // JSXNamespacedName: noop,
});

function buildCallReactCreateElement(type, props, children = []) {
  return {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: { type: 'Identifier', name: 'React' },
      property: { type: 'Identifier', name: 'createElement' },
    },
    arguments: [type, props, ...children],
  };
}

function buildJSXMemberExpression(node) {
  let object;
  if (node.object.type === 'JSXMemberExpression') {
    object = buildJSXMemberExpression(node.object);
  } else {
    object = {
      type: 'Identifier',
      name: node.object.name,
    };
  }

  return {
    type: 'MemberExpression',
    object,
    property: {
      type: 'Identifier',
      name: node.property.name,
    },
  };
}

function buildJSXProps(attributes = []) {
  if (attributes.length === 0) {
    return { type: 'Literal', value: null };
  }

  const properties = [];
  for (const attr of attributes) {
    if (attr.type === 'JSXAttribute') {
      if (attr.name.type === 'JSXNamespacedName') {
        throw new Error('React JSX does not support namespace tags');
      }

      let value;
      if (!attr.value) {
        value = { type: 'Literal', value: true };
      } else if (attr.value.type === 'Literal') {
        value = { type: 'Literal', value: attr.value.value };
      } else if (attr.value.type === 'JSXExpressionContainer') {
        value = transformJSX(attr.value.expression);
      }
      properties.push({
        type: 'Property',
        key: { type: 'Identifier', name: attr.name.name },
        value,
        kind: 'init',
      });
    } else if (attr.type === 'JSXSpreadAttribute') {
      properties.push({
        type: 'SpreadElement',
        argument: transformJSX(attr.argument),
      });
    }
  }
  return {
    type: 'ObjectExpression',
    properties,
  };
}

function buildJSXChildren(children = []) {
  const _children = [];
  for (const node of children) {
    if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
      _children.push(transformJSX(node));
    } else if (node.type === 'JSXExpressionContainer') {
      if (node.expression.type !== 'JSXEmptyExpression') {
        _children.push(transformJSX(node.expression));
      }
    } else if (node.type === 'JSXText') {
      if (node.value.trim()) {
        const value = node.value.replace(/\n\s+/g, ' ');
        _children.push({ type: 'Literal', value });
      }
    }
  }
  return _children;
}

// React.createElement(type, arguments, ...children)
function buildJSXElement(node) {
  let type;
  const { name: tag, attributes } = node.openingElement;
  if (tag.type === 'JSXIdentifier') {
    const tagName = tag.name;
    if (/^[A-Z]/.test(tagName)) {
      type = { type: 'Identifier', name: tagName };
    } else {
      type = { type: 'Literal', value: tagName };
    }
  } else if (tag.type === 'JSXMemberExpression') {
    type = buildJSXMemberExpression(tag);
  }

  return buildCallReactCreateElement(
    type,
    buildJSXProps(attributes),
    buildJSXChildren(node.children)
  );
}

// React.createElement(React.Fragment, null, ...children)
function buildJSXFragment(node) {
  const type = {
    type: 'MemberExpression',
    object: { type: 'Identifier', name: 'React' },
    property: { type: 'Identifier', name: 'Fragment' },
  };

  return buildCallReactCreateElement(
    type,
    buildJSXProps([]),
    buildJSXChildren(node.children)
  );
}

function replaceWith(node, newNode) {
  Object.keys(node).forEach((key) => {
    node[key] = undefined;
  });
  Object.assign(node, newNode);
}

function transformJSX(node) {
  acornWalk.simple(node, {
    JSXElement(node) {
      replaceWith(node, buildJSXElement(node));
    },
    JSXFragment(node) {
      replaceWith(node, buildJSXFragment(node));
    },
  });
  return node;
}

function transform(expression) {
  let node = Parser.parseExpressionAt(String(expression), 0, {
    ecmaVersion: 'latest',
    locations: false,
    ranges: false,
  });
  node = transformJSX(node);

  return generate(node, {
    indent: '  ',
    comments: false,
  });
}

module.exports = {
  transform,
};
