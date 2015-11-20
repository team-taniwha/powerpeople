const {h} = require('@cycle/dom');
const FocusHook = require('virtual-dom/virtual-hyperscript/hooks/focus-hook');
const calculateGuessScore = require('../calculations/guess-score');

const Color = require('color');

const natural = require('natural');
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
        h('div', [
          h('h2.staff-member-name', staffMember.name),
          h('h3.staff-member-position', staffMember.position),
        ]),

        h(`.score-${guessScore}`, guessMessage(guessScore)),
        h(`button.proceed ${buttonClicked ? '.clicked' : ''}`, 'Next')
      ])
  );
}

function renderFlashcard (flashcard, index, showMoreInformation, guessResult, guessScore, guessValue) {

  let guessInputProperties = {type: 'text', value: guessValue};

  if (index === 1) {
    const score = natural.JaroWinklerDistance(guessValue || '', flashcard.staff_member.name)

    guessInputProperties['focus-hook'] = new FocusHook();
    guessInputProperties.style = {
      color: Color('#FA0E6A').darken(1 - score).hslString()
    }
  }
  return (
    h(`.flashcard.position-${index}`, {key: flashcard.id}, [
      h('div.staff-info', [
        h('div', [
          h('img', {attributes: {src: flashcard.staff_member.image_url }}), 
        ]),  
        
        displayMoreInfoIfGuessed(flashcard.staff_member, showMoreInformation, guessResult, guessScore, index === 0),
      ]),

      h('div', {attributes: displayIf(!showMoreInformation)}, [
        h('div', [
          h('input.guess.name', guessInputProperties)
        ]),

        h('div', [
          h('button.makeGuess', 'Guess')
        ])
      ]),

    ])
  );
}

module.exports = renderFlashcard;
