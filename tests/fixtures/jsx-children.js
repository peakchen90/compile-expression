exports.input = `
<div a="1">
  <a b="2">
    abc
    {foo()}
    {/* a */}
  </a>
</div>
`;

exports.output = `
React.createElement("div", {
  a: "1"
}, React.createElement("a", {
  b: "2"
}, " abc ", foo()))
`;
