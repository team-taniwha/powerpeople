/* globals $ */

const Cycle = require('@cycle/core');
const {makeDOMDriver} = require('@cycle/dom');

const renderFlashcard = require('./views/flashcard');

function log (label) { return (thing) => { console.log(label, thing); return thing; }; }

function view ({state$}) {
  return state$.map(log('state')).map(([flashcard, showMoreInformation, guessResult]) => (
    renderFlashcard(flashcard, showMoreInformation, guessResult)
  ));
}

function model ({guess$, nextFlashcard$}) {
  const flashcard$ = Cycle.Rx.Observable.from(window.flashcards)
    .concat(Cycle.Rx.Observable.never());

  const showMoreInformation$ = Cycle.Rx.Observable.merge(
    guess$.map(log('guess')).map(_ => true),
    nextFlashcard$.map(_ => false)
  ).map(log('showMoreInformation'));

  return {
    state$: Cycle.Rx.Observable.combineLatest(
      Cycle.Rx.Observable.zip(flashcard$, nextFlashcard$, (f, _) => f),
      showMoreInformation$,
      guess$
    ).map(log('zippedFlashcards'))
  };
}

function intent (DOM) {
  const guessValue$ = DOM.get('.guess', 'change').map(e => e.target.value).startWith('');

  return {
    guess$: DOM.get('.makeGuess', 'click')
      .startWith({name: 'nah'})
      .withLatestFrom(guessValue$, (guess, guessValue) => ({name: guessValue})),

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

