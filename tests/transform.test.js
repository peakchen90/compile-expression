const path = require('path');
const fs = require('fs');
const { transform } = require('../src');

describe('Transform Fixtures', () => {
  const fixturesRoot = path.join(__dirname, 'fixtures');
  const fixtures = fs.readdirSync(fixturesRoot);

  for (const fixture of fixtures) {
    const filename = path.join(fixturesRoot, fixture);
    const match = fixture.match(/^(.+)\.js$/);
    if (match && fs.statSync(filename).isFile()) {
      test(match[1], () => {
        const { input, output } = require(filename);
        expect(transform(input.trim())).toBe(output.trim());
      });
    }
  }
});
