var helper = require('helper');
var debug = require('debug')('analyzer');
var _ = require('lodash');

//Analyzes a block of text against a dataset
function analyzeText(text, dataset) {
  var tris = helper.generateTrigrams(text);
  debug(`read text and generated ${tris.length} trigrams`);

  return generateReport(dataset, tris);
}

/**
 * Takes a dataset and compares trigrams against the dataset to determine best match
 */
function generateReport(dataset, tris) {
  debug('starting report generation');
  //First get all the possible languages from the data set and their counts
  var langs = Object.keys(dataset.settings);
  var multiplier = 1000;

  var report = {};

  //From our langs initialize the report
  langs.forEach(function(lang_key) {
    report[lang_key] = {
      score: 0
    };
  });

  tris.forEach(function(tri) {
    var result = pullFromDataset(dataset, tri);

    //If we got a result for this trigram
    if (result) {
      langs.forEach(function(lang) {
        //If this language exists in the result
        if (result[lang]) {
          var count = result[lang];
          var total_for_lang = dataset.settings[lang].total;
          report[lang].score = count * multiplier / total_for_lang;
        }
      });
    }
  });

  debug('finished generating report');
}

function pullFromDataset(dataset, tri) {
  if (dataset && dataset[tri[0]] && dataset[tri[0]][tri[1]] && dataset[tri[0]][tri[1]][tri[2]]) {
    return dataset[tri[0]][tri[1]][tri[2]];
  } else {
    return null;
  }
}

module.exports = analyzeText;
