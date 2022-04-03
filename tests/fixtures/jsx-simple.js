exports.input = `<div a="1" b={1 + 3} {...c.d}>abc</div>`;

exports.output = `
React.createElement("div", {
  a: "1",
  b: 1 + 3,
  ...c.d
}, "abc")
`;
