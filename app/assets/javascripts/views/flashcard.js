const {h} = require('@cycle/dom');

function guessMessage (score) {
  if (score === 5) {
    return 'Perfect!';
  } else if (score === 4) {
    return 'Very close!';
  } else if (score === 3) {
    return 'Almost...';
  } else if (score === 2) {
    return 'Not quite...';
  } else if (score === 1) {
    return 'Long way off.';
  }
}

function displayIf (bool) {
  return {style: `display: ${bool ? 'inline-block' : 'none'}`};
}

function displayMoreInfoIfGuessed (staffMember, showMoreInformation, guessResult, guessScore) {
  return (
    h('.more-info', {attributes: displayIf(showMoreInformation)}, [
      h('p', guessMessage(guessScore)),
      h('h2', staffMember.name),
      h('h3', staffMember.position),
      h('p', staffMember.bio),
      h('button.proceed', 'Next')
    ])
  );
}

function renderFlashcard (flashcard, showMoreInformation, guessResult, guessScore, guessValue) {
  return (
    h('.flashcard', [
      h('img', {attributes: {src: flashcard.staff_member.image_url}}),

      h('div', {attributes: displayIf(!showMoreInformation)}, [
        h('input.guess', {value: guessValue}),
        h('button.makeGuess', 'Guess')
      ]),

      displayMoreInfoIfGuessed(flashcard.staff_member, showMoreInformation, guessResult, guessScore)
    ])
  );
}

module.exports = renderFlashcard;
