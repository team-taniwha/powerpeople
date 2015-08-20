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
      h(`div.name.score-${guessScore}`, staffMember.name),
      h('h3', staffMember.position),
      h('button.proceed', 'Next')
    ])
  );
}

function renderFlashcard (flashcard, index, showMoreInformation, guessResult, guessScore, guessValue) {
  return (
    h(`.flashcard.position-${index}`, {key: flashcard.id}, [
      h('img', {attributes: {src: flashcard.staff_member.image_url}}),

      h('div', {attributes: displayIf(!showMoreInformation)}, [
        h('div', [
          h('input.guess.name', {type: 'text', value: guessValue})
        ]),

        h('div', [
          h('button.makeGuess', 'Guess')
        ])
      ]),

      displayMoreInfoIfGuessed(flashcard.staff_member, showMoreInformation, guessResult, guessScore)
    ])
  );
}

module.exports = renderFlashcard;
