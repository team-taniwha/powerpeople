/* globals $ */

const Cycle = require('@cycle/core');
const {h} = require('@cycle/dom');
const _ = require('lodash');

const Rx = Cycle.Rx;

const renderFlashcard = require('./views/flashcard');
const calculateGuessScore = require('./calculations/guess-score');
const sendGuessesToServer = require('./server/guesses');

function log (label) { return (thing) => { console.log(label, thing); return thing; }; }

function view (state) {
  return (
    h('div.flashcards', [
      state.flashcardsToReview.map((flashcard, index) => (
        renderFlashcard(
          flashcard,
          index,
          state.mode === 'madeGuess' || index === 0,
          state.guessResult,
          _.last(state.guesses) && _.last(state.guesses).score,
          state.guessInputValue
        ))
      )
    ])
  );
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

function makeGuess (guessText) {
  return state => {
    const flashcard = state.flashcards[state.flashcardReviewIndex + 1];

    const newGuess = {
      name: guessText,
      score: calculateGuessScore(flashcard.staff_member.name, guessText),
      flashcard
    };

    const stateUpdates = {
      guesses: state.guesses.concat([newGuess]),
      mode: 'madeGuess'
    };

    return Object.assign(
      {},
      state,
      stateUpdates
    );
  };
}

function nextFlashcard () {
  return state => {
    const updatedFlashcardReviewIndex = state.flashcardReviewIndex + 1;

    const stateUpdates = {
      flashcardReviewIndex: updatedFlashcardReviewIndex,
      flashcardsToReview: state.flashcards.slice(updatedFlashcardReviewIndex, updatedFlashcardReviewIndex + 3),
      mode: 'readyToGuess'
    };

    return Object.assign(
      {},
      state,
      stateUpdates
    );
  };
}

function makeGuessRequest (guess) {
  return {
    url: '/flashcards/' + guess.flashcard.id,
    method: 'POST',
    dataType: 'JSON',
    data: {
      recollection_quality: guess.score,
      _method: 'PUT'
    }
  };
}

function model ({guessButton$, guessText$, nextFlashcard$}, flashcards) {
  const initialState = {
    flashcards,
    flashcardsToReview: flashcards.slice(0, 3),
    flashcardReviewIndex: 0,
    guesses: [],
    mode: 'readyToGuess'
  };

  const action$ = Rx.Observable.merge(
    guessButton$.withLatestFrom(guessText$, (_, text) => makeGuess(text)),
    nextFlashcard$.map(nextFlashcard)
  );

  const state$ = action$
    .scan((state, action) => action(state), initialState)
    .startWith(initialState)
    .distinctUntilChanged();

  const HTTP = state$.pluck('guesses')
    .filter(guesses => guesses.length >= 1)
    .map(_.last)
    .distinctUntilChanged()
    .map(makeGuessRequest);

  return {
    state$,
    HTTP,
    DOM: state$.map(view)
  };
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
    guessText$: DOM.select('.guess').events('input').map(e => e.target.value).startWith(''),
    guessButton$: DOM.select('.makeGuess').events('click'),
    nextFlashcard$: DOM.select('.proceed').events('click'),

    enterKey$: keyPress$.filter(keyPressed('Enter')),
    scroll$,
    transitionEnd$
  };
}

module.exports = function Flashcards ({DOM}, props) {
  return model(intent(DOM), props.flashcards);
}
