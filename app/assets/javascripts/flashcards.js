/* globals $ */

const Cycle = require('@cycle/core');
const {h, makeDOMDriver} = require('@cycle/dom');

function log (label) { return (thing) => { console.log(label, thing); return thing; };}

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

function view ({state$}) {
  return state$.map(log('state')).map(({flashcard, showMoreInformation}) => (
    h('.flashcard', [
      h('img', {attributes: {src: flashcard.staff_member.image_url}}),
      h('input'),
      h('button.guess', 'Guess'),
      displayMoreInfoIfGuessed(flashcard.staff_member, showMoreInformation)
    ])
  ));
}

function model ({guess$, nextFlashcard$}) {
  const flashcard$ = Cycle.Rx.Observable.from(window.flashcards)
    .concat(Cycle.Rx.Observable.never());

  const showMoreInformation$ = Cycle.Rx.Observable.merge(
    guess$.map(_ => true),
    nextFlashcard$.map(_ => false)
  ).map(log('showMoreInformation'));

  return {
    state$: Cycle.Rx.Observable.combineLatest(
      Cycle.Rx.Observable.zip(flashcard$, nextFlashcard$, (f, _) => f),
      showMoreInformation$,
      (flashcard, showMoreInformation) => ({flashcard, showMoreInformation})
    ).map(log('zippedFlashcards'))
  };
}

function intent (DOM) {
  return {
    guess$: DOM.get('.guess', 'click').startWith({name: 'nah'}),
    nextFlashcard$: DOM.get('.proceed', 'click').startWith(null)
  };
}

function main ({DOM}) {
  return {
    DOM: view(model(intent(DOM)))
  };
}

$(() => {
  const drivers = {
    DOM: makeDOMDriver('#app')
  };

  Cycle.run(main, drivers);
});

