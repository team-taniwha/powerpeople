const {h} = require('@cycle/dom');

function displayMoreInfoIfGuessed (staffMember, hasGuessed) {
  return (
    h('.more-info', {attributes: {style: `display: ${hasGuessed ? 'block' : 'none'}`}}, [
      h('h2', staffMember.name),
      h('h3', staffMember.position),
      h('p', staffMember.bio),
      h('button.proceed', 'Next')
    ])
  );
}

function renderFlashcard (flashcard, showMoreInformation) {
  return (
    h('.flashcard', [
      h('img', {attributes: {src: flashcard.staff_member.image_url}}),
      h('input'),
      h('button.guess', 'Guess'),
      displayMoreInfoIfGuessed(flashcard.staff_member, showMoreInformation)
    ])
  );
}

module.exports = renderFlashcard;
