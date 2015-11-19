/* globals $ */

const Cycle = require('@cycle/core');
const {h, makeDOMDriver} = require('@cycle/dom');
const _ = require('lodash');

const Rx = Cycle.Rx;

const renderFlashcard = require('./views/flashcard');
const calculateGuessScore = require('./calculations/guess-score');
const sendGuessesToServer = require('./server/guesses');

function log (label) { return (thing) => { console.log(label, thing); return thing; }; }

function view ({state$}) {
  return (
    state$.map(log('state')).map(({state, flashcards, guessResult, guessScore, guessInputValue}) => (
      h('div.flashcards', [
        flashcards.map((flashcard, index) => (
          renderFlashcard(
            flashcard,
            index,
            state === 'madeGuess' || index === 0,
            guessResult,
            guessScore.score,
            guessInputValue
          ))
        )
      ])
    )
  ));
}

function focusSecondInput () {
  const secondInput = $('input').get(1);

  if (secondInput) {
    secondInput.focus();
  }
}

function scrollToTop () {
  scroll(0, 0);
}

function dirtySideEffects (scroll$, stateReadyToGuess$) {
  stateReadyToGuess$.delay(2000).forEach(focusSecondInput);

  scroll$.sample(Cycle.Rx.Observable.interval(100)).forEach(scrollToTop);
}

function model ({}) {
}

function keyPressed (key) {
  return (ev) => ev.key === key || ev.keyIdentifier === key;
}

function intent (DOM) {
  const keyPress$ = Cycle.Rx.Observable.fromEvent(document.body, 'keypress');
  const scroll$ = Cycle.Rx.Observable.fromEvent(document, 'scroll');

  const transitionEnd$ = Cycle.Rx.Observable.merge(
    DOM.select(':root').events('transitionend'),
    DOM.select(':root').events('webkitTransitionEnd')
  );

  return {
    guessValue$: DOM.get('.guess', 'input').map(e => e.target.value).startWith(''),
    guessButton$: DOM.get('.makeGuess', 'click'),
    nextFlashcard$: DOM.get('.proceed', 'click'),

    enterKey$: keyPress$.filter(keyPressed('Enter')),
    scroll$,
    transitionEnd$
  };
}

module.exports = function Flashcards ({DOM}) {
  return {
    DOM: view(model(intent(DOM)))
  };
}
