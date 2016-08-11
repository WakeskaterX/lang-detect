function cleanWord(word, language) {
  var re = generateRegex(language);
  return word.replace(re, '').toLowerCase();
}

function generateRegex(language) {
  switch(language) {
    case 'en':
      return /[^a-z]/gi;
    case 'es':
      return /[^a-zñáéíóúü]/gi;
    default:
      return /[^a-zñáéíóúü]/gi;
  }
}

function generateTrigrams(text, language) {
  var trigrams = [];
  var words = text.split(' ');
  var word_boundary = '\u0020';
  words.forEach(function(word) {
    var characters = cleanWord(word, language).split('');
    characters.unshift(word_boundary);
    characters.push(word_boundary);

    for (var i = 0; i < characters.length - 2; i++) {
      var tri = characters.slice(i, i + 3).join('');
      trigrams.push(tri);
    }
  });

  return trigrams;
}

module.exports = {
  cleanWord,
  generateTrigrams
};