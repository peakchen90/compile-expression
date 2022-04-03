exports.input = `<Foo.Bar.A a="1">bar</Foo.Bar.A>`;

exports.output = `React.createElement(Foo.Bar.A, {
  a: "1"
}, "bar")`;
