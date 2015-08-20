const natural = require('natural');

function calculateGuessScore (guess, actual) {
  const jaroWinklerDistance = natural.JaroWinklerDistance(guess, actual);

  if (jaroWinklerDistance > 0.98) {
    return 5;
  } else if (jaroWinklerDistance > 0.9) {
    return 4;
  } else if (jaroWinklerDistance > 0.8) {
    return 3;
  } else if (jaroWinklerDistance > 0.7) {
    return 2;
  } else {
    return 1;
  }
}

module.exports = calculateGuessScore;
