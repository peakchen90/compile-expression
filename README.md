# compile-expression

Compile javascript expressions (including jsx), producing javascript values

## Environment

- Node: `>= 10.8.0`
- Browser: Not support

## Install

```bash
npm i -S compile-expression
```

## Usage

```js
const {compileExpression} = require('compile-expression');

compileExpression('1 + 2');
// 3

compileExpression('foo.toFixed(2)', { foo: 5 });
// "5.00"

compileExpression('<div>foo</div>', { React: require('react') });
// {
//   '$$typeof': Symbol(react.element),
//   type: 'div',
//   key: null,
//   ref: null,
//   props: { children: 'foo' },
//   _owner: null,
//   _store: {}
// }
```
