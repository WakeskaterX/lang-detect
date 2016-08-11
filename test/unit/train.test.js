var lang = require('../../index.js');
var chai = require('chai');
var _ = require('lodash');

var assert = chai.assert;
var expect = chai.expect;
chai.should();

describe('Training Data Tests', function() {
  //Global Test Variables
  var dataset;

  //Preload
  before(function() {
    dataset = {
      settings: {}
    };
  });

  it('should take a string and a language and convert it to trigrams and save to the dataset', function() {
    var test_data = "This is english";

    var result = lang.trainData(test_data, 'en', dataset);
    var tris = [" th", "thi", "his", "is ", " is", "is ", " en", "eng", "ngl", "gli", "lis", "ish", "sh "];

    assertTrigrams(result, tris);
  });

  it('should remove any punctuation and numbers', function() {
    resetDataset();
    var test_data = ",suck!!!y 123123data$##!";

    var result = lang.trainData(test_data, 'en', dataset);
    var tris = [" su", "suc", "uck", "cky", "ky ", " da", "dat", "ata", "ta "];

    assertTrigrams(result, tris);
  });

  function resetDataset() {
    dataset = {
      settings: {}
    };
  }
});

function assertTrigrams(dataset, tris) {
  expect(dataset.settings.en.total).to.equal(tris.length);
  var triMap = tris.reduce(function(acc, curr) {
    var existing = _.find(acc, {tri: curr});
    if (existing) {
      existing.num++
    } else {
      acc.push({
        tri: curr,
        num: 1
      });
    }

    return acc;
  }, []);

  triMap.forEach(function(tricount) {
    var letter_1 = tricount.tri[0];
    var letter_2 = tricount.tri[1];
    var letter_3 = tricount.tri[2];
    expect(dataset[letter_1][letter_2][letter_3].en).to.equal(tricount.num);
  });
}