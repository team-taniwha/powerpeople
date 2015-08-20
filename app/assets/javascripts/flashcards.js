/* globals $ */

const Cycle = require('@cycle/core');
const {h, makeDOMDriver} = require('@cycle/dom');

function log (thing) { console.log(thing); return thing; }

function view ({flashcard$}) {
  return flashcard$.map(log).map(flashcard =>
    h('.flashcard', [
      h('img', {attributes: {src: flashcard.staff_member.image_url}}),
      h('input'),
      h('button.guess', 'Guess')
    ])
  );
}

function model ({guess$}) {
  const people$ = Cycle.Rx.Observable.from(window.flashcards)
    .concat(Cycle.Rx.Observable.never());

  return {
    flashcard$: Cycle.Rx.Observable.zip(
      people$,
      guess$,
      (person, guess) => {
        return person;
      }
    )
  };
}

function intent (DOM) {
  return {
    guess$: DOM.get('.guess', 'click').startWith({name: 'nah'})
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

