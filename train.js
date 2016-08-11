'use strict'
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var helper = require('./helper.js');
var debug = require('debug')('train');

/**
 * Trains Data Sets by reading known language blocks of text
 *
 * @param {string} text
 * @param {string} language - 2 Letter Language Code
 * @param {object} dataset
 */
function trainData(text, language, dataset) {
  debug('starting process');

  var trigrams = helper.generateTrigrams(text, language);

  addTrigramsToDataset(dataset, trigrams, language)

  debug('ending process');
  return dataset;
}

function addTrigramsToDataset(dataset, trigrams, language) {
  if (!dataset.settings[language]) dataset.settings[language] = { total: 0 };

  trigrams.forEach(function(tri) {
    let letter1 = tri[0];
    let letter2 = tri[1];
    let letter3 = tri[2];

    //Add 1 count to the total trigrams for this language
    dataset.settings[language].total++;

    if (!dataset[letter1]) dataset[letter1] = {};
    if (!dataset[letter1][letter2]) dataset[letter1][letter2] = {};
    if (!dataset[letter1][letter2][letter3]) {
      dataset[letter1][letter2][letter3] = {};
      dataset[letter1][letter2][letter3][language] = 0;
    }

    //Add 1 count for this specific trigram
    dataset[letter1][letter2][letter3][language] += 1;
  });
}

module.exports = trainData;
