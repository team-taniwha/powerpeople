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
  const secondInput = $('input').select(1);

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
  const keyPress$ = DOM.select('flashcards').events('keypress');
  const scroll$ = DOM.select('flashcards').events('scroll');

  const transitionEnd$ = Cycle.Rx.Observable.merge(
    DOM.select(':root').events('transitionend'),
    DOM.select(':root').events('webkitTransitionEnd')
  );

  return {
    guessValue$: DOM.select('.guess').events('input').map(e => e.tarselect.value).startWith(''),
    guessButton$: DOM.select('.makeGuess').events('click'),
    nextFlashcard$: DOM.select('.proceed').events('click'),

    enterKey$: keyPress$.filter(keyPressed('Enter')),
    scroll$,
    transitionEnd$
  };
}

module.exports = function Flashcards ({DOM, props}) {
  const initialState = {
    flashcards: props.flashcards.slice(0, 3)
  };

  return {
    state$: Rx.Observable.just(initialState)
  };
}
