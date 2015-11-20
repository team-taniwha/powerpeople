const {h} = require('@cycle/dom');
const FocusHook = require('virtual-dom/virtual-hyperscript/hooks/focus-hook');

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

function displayMoreInfoIfGuessed (staffMember, showMoreInformation, guessResult, guessScore, buttonClicked=false) {
  return (
    h('.more-info', {attributes: displayIf(showMoreInformation)}, [
      h('.name', staffMember.name),
      h('h3', staffMember.position),
      h(`h2.score-${guessScore}`, guessMessage(guessScore)),
      h(`button.proceed ${buttonClicked ? '.clicked' : ''}`, 'Next')
    ])
  );
}

function renderFlashcard (flashcard, index, showMoreInformation, guessResult, guessScore, guessValue) {
  let guessInputProperties = {type: 'text', value: guessValue};

  if (index == 1) {
    guessInputProperties['focus-hook'] = new FocusHook();
  }
  return (
    h(`.flashcard.position-${index}`, {key: flashcard.id}, [
      h('img', {attributes: {src: flashcard.staff_member.image_url}}),

      h('div', {attributes: displayIf(!showMoreInformation)}, [
        h('div', [
          h('input.guess.name', guessInputProperties)
        ]),

        h('div', [
          h('button.makeGuess', 'Guess')
        ])
      ]),

      displayMoreInfoIfGuessed(flashcard.staff_member, showMoreInformation, guessResult, guessScore, index === 0)
    ])
  );
}

module.exports = renderFlashcard;
