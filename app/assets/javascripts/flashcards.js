/* globals $ */

const Cycle = require('@cycle/core');
const {h, makeDOMDriver} = require('@cycle/dom');

function log (thing) { console.log(thing); return thing; }

function view ({flashcard$}) {
  return flashcard$.map(log).map(flashcard =>
    h('.flashcard', [
      h('img', {attributes: {src: flashcard.staff_member.image_url}}),
      h('input'),
      h('button', 'Guess')
    ])
  );
}

function model (DOM) {
  return {
    flashcard$: Cycle.Rx.Observable.from(window.flashcards)
  };
}

function main ({DOM}) {
  return {
    DOM: view(model(DOM))
  };
}

$(() => {
  const drivers = {
    DOM: makeDOMDriver('#app')
  };

  Cycle.run(main, drivers);
});

