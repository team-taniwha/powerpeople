const {h} = require('@cycle/dom');
const FocusHook = require('virtual-dom/virtual-hyperscript/hooks/focus-hook');

const Color = require('color');
const natural = require('natural');

function guessMessage (score) {
  if (score === 5) {
    return 'Perfect!';
  } else if (score === 4) {
    return 'Very close!';
  } else if (score === 3) {
    return 'Almost!';
  } else if (score === 2) {
    return 'Not quite!';
  } else if (score === 1) {
    return 'Go say hello!';
  }
}

function displayIf (bool) {
  return {style: `display: ${bool ? 'inline-block' : 'none'}`};
}

function displayMoreInfoIfGuessed (staffMember, showMoreInformation, guessScore, nameColor, buttonClicked=false) {
  return (
    h('.more-info', {attributes: displayIf(showMoreInformation)}, [
      h('div', [
        h('h2.staff-member-name', {style: {color: nameColor}}, staffMember.first_name),
        h('h3.staff-member-position', staffMember.position),
      ]),

      h(`.score-${guessScore.score}`, guessMessage(guessScore.score)),
      h(`button.proceed ${buttonClicked ? '.clicked' : ''}`, 'Next')
    ])
  );
}

function renderNewBanner (flashcard) {
  if (!flashcard.staff_member['joined_powershop_recently?']) {
    return null;
  }

  return (
    h('div.new-banner', 'New Staff Member!')
  );
}

function renderFlashcard (flashcard, index, showMoreInformation, guessScore, guessValue) {
  let guessInputProperties = {type: 'text', value: guessValue};

  let nameColor = 'black';

  if (index < 2) {
    let score = natural.JaroWinklerDistance(guessValue || '', flashcard.staff_member.first_name);

    if (guessScore.flashcard.staff_member.first_name === flashcard.staff_member.first_name) {
      score = guessScore.distance;
    }

    nameColor = Color('#FA0E6A').darken(1 - score).hslString();

    guessInputProperties['focus-hook'] = new FocusHook();
    guessInputProperties.style = {
      color: nameColor
    }
  }

  return (
    h(`.flashcard.position-${index}`, {key: flashcard.id}, [

      h('div.staff-info', [
        h('div', [
          h('img', {attributes: {src: flashcard.staff_member.image_url}})
        ]),

        renderNewBanner(flashcard),

        displayMoreInfoIfGuessed(
          flashcard.staff_member,
          showMoreInformation,
          guessScore,
          nameColor,
          index === 0
        )
      ]),

      h('.guess-input-container', {attributes: displayIf(!showMoreInformation)}, [
        h('div', [
          h('input.guess.name', guessInputProperties)
        ]),

        h('div', [
          h('button.makeGuess', 'Guess')
        ])
      ])
    ])
  );
}

module.exports = renderFlashcard;
