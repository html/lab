var mmlParser = require('../../src/mw-helpers/mml-parser'),
    fs = require("fs"),

    vows = require("vows"),
    assert = require("assert"),

    suite = vows.describe('mw-helpers/mml-parser');

suite.addBatch({
  "MML to JSON Conversion": {
    topic: './test/mml-conversions/',

    "converted mml files match expected output": function(testDir) {
      var mmlFiles = fs.readdirSync(testDir + "input-mml/"),
          mml, mmlFile, modelName, conversion, expectedStr, convertedStr,
          i, ii;
      for (i=0, ii=mmlFiles.length; i<ii; i++) {
        mmlFile = mmlFiles[i];
        mml = fs.readFileSync(testDir + "input-mml/" + mmlFile).toString();
        modelName = /\/?([^\/]*)\.mml/.exec(mmlFile)[1];

        conversion = mmlParser.parseMML(mml);

        assert(conversion.errors == undefined, "The file "+modelName+" failed to convert: "+conversion.errors);

        convertedModel = conversion.json;

        assert(convertedModel);

        expectedModelJson = fs.readFileSync(testDir + "expected-json/" + modelName + ".json").toString();
        expectedModel = JSON.parse(expectedModelJson);

        assert.deepEqual(convertedModel, expectedModel);
      }
    }
  }

});


suite.export(module);
