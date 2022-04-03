exports.input = `<div a={<b c="1">123</b>}/>`;

exports.output = `React.createElement("div", {
  a: React.createElement("b", {
    c: "1"
  }, "123")
})`;
