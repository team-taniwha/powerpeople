const natural = require('natural');

function calculateGuessScore (guess, actual) {
  const jaroWinklerDistance = natural.JaroWinklerDistance(guess, actual);

  if (jaroWinklerDistance === 1) {
    return 5;
  } else if (jaroWinklerDistance > 0.92) {
    return 4;
  } else if (jaroWinklerDistance > 0.85) {
    return 3;
  } else if (jaroWinklerDistance > 0.73) {
    return 2;
  } else {
    return 1;
  }
}

module.exports = calculateGuessScore;
