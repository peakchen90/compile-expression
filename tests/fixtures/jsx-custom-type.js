exports.input = `<Foo a="1">bar</Foo>`;

exports.output = `React.createElement(Foo, {
  a: "1"
}, "bar")`;
