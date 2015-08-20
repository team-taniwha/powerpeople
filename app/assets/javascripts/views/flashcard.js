const {h} = require('@cycle/dom');

function displayMoreInfoIfGuessed (staffMember, hasGuessed, guessResult) {
  return (
    h('.more-info', {attributes: {style: `display: ${hasGuessed ? 'block' : 'none'}`}}, [
      h('p', `You guessed: ${guessResult.name}`),
      h('h2', staffMember.name),
      h('h3', staffMember.position),
      h('p', staffMember.bio),
      h('button.proceed', 'Next')
    ])
  );
}

function renderFlashcard (flashcard, showMoreInformation, guessResult) {
  return (
    h('.flashcard', [
      h('img', {attributes: {src: flashcard.staff_member.image_url}}),
      h('input.guess'),
      h('button.makeGuess', 'Guess'),
      displayMoreInfoIfGuessed(flashcard.staff_member, showMoreInformation, guessResult)
    ])
  );
}

module.exports = renderFlashcard;
