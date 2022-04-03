const { compileExpression } = require('../src');
const React = require('react');

describe('Compile Expression', () => {
  test('normal', () => {
    expect(compileExpression('1 + 2')).toBe(3);
    expect(compileExpression('1 + a', { a: 3 })).toBe(4);
  });

  test('jsx element', () => {
    const value = compileExpression('<div a="1">123</div>', { React });
    expect(React.isValidElement(value)).toBeTruthy();
    expect(value).toMatchObject({
      type: 'div',
      props: {
        a: '1',
        children: '123',
      },
    });
  });

  test('jsx fragment', () => {
    const value = compileExpression('<>123</>', { React });
    expect(React.isValidElement(value)).toBeTruthy();
    expect(value).toMatchObject({
      type: React.Fragment,
      props: {
        children: '123',
      },
    });
  });
});
