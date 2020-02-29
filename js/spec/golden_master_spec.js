describe("Golden Master for GildedRose", () => {
  var days = 100;
  var currentItems = [...itemList];
  var currentLines = [];
  generate_fixtures(currentLines, days, currentItems);

  var linesToCompare = Math.min(currentLines.length, goldenMasterLines.length);

  var expectMatchingLine = (line, currentLine, goldenMasterLine) => {
    it(`${currentLine} shuold equal ${goldenMasterLine}`, () => {
        expect(currentLine).toEqual(goldenMasterLine);
      });
  }

  for(var line = 0; line < linesToCompare; line++) {
    describe(`match line ${line}`, () => {
      expectMatchingLine(line, currentLines[line], goldenMasterLines[line])
    })
  }
});
