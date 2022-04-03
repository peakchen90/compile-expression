exports.input = `
<>
  <div>
    <>
      <a>1</a>
      <b>2</b>
    </>
  </div>
</>
`;

exports.output = `
React.createElement(React.Fragment, null, React.createElement("div", null, React.createElement(React.Fragment, null, React.createElement("a", null, "1"), React.createElement("b", null, "2"))))
`;
