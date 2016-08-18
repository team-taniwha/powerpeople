/* globals $ */

const {h} = require('@cycle/dom');
const _ = require('lodash');

const Rx = require('rx');

const renderFlashcard = require('./views/flashcard');
const calculateGuessScore = require('./calculations/guess-score');
const natural = require('natural');

function log (label) { return (thing) => { console.log(label, thing); return thing; }; }

function view (state) {
  return (
    h('div.flashcards', [
      state.flashcardsToReview.map((flashcard, index) => (
        renderFlashcard(
          flashcard,
          index,
          state.mode === 'madeGuess' || index === 0,
          _.last(state.guesses) || {score: 0, distance: 1000, flashcard: {staff_member: {first_name: ''}}},
          state.guessInputValue
        ))
      )
    ])
  );
}

function scrollToTop () {
  scroll(0, 0);
}

function dirtySideEffects () {
  Rx.Observable.interval(50).forEach(scrollToTop);
}

function makeGuessRequest (guess) {
  return {
    url: '/flashcards/' + guess.flashcard.id,
    method: 'PUT',
    type: 'application/json',
    send: {
      recollection_quality: guess.score,
      _method: 'PUT',
      authenticity_token: global.authenticity_token
    }
  };
}

function keyPressed (key) {
  return (ev) => ev.key === key || ev.keyIdentifier === key;
}

function intent (DOM) {
  const keyPress$ = Rx.Observable.fromEvent(document.body, 'keypress');
  const scroll$ = Rx.Observable.fromEvent(document.body, 'scroll');

  const transitionEnd$ = Rx.Observable.merge(
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

function makeGuess (guessText) {
  return function guess (state) {
    const flashcard = state.flashcards[state.flashcardReviewIndex + 1];

    const newGuess = {
      name: guessText,
      score: calculateGuessScore(flashcard.staff_member.first_name, guessText),
      flashcard,
      distance: natural.JaroWinklerDistance(flashcard.staff_member.first_name, guessText)
    };

    const stateUpdates = {
      guesses: state.guesses.concat([newGuess]),
      mode: 'madeGuess'
    };

    dirtySideEffects();

    return Object.assign(
      {},
      state,
      stateUpdates
    );
  };
}

function nextFlashcard () {
  return function goToNextFlashcard (state) {
    const updatedFlashcardReviewIndex = state.flashcardReviewIndex + 1;

    const stateUpdates = {
      flashcardReviewIndex: updatedFlashcardReviewIndex,
      flashcardsToReview: state.flashcards.slice(updatedFlashcardReviewIndex, updatedFlashcardReviewIndex + 3),
      mode: 'transitioning',
      guessInputValue: ''
    };

    return Object.assign(
      {},
      state,
      stateUpdates
    );
  };
}

function handleEnterKey (text) {
  return function enterKeyPressed (state) {
    if (state.mode === 'readyToGuess') {
      return makeGuess(text)(state);
    } else if (state.mode === 'madeGuess') {
      return nextFlashcard()(state);
    }

    return state;
  };
}

function transitionEnd () {
  return function endTransition (state) {
    if (state.mode !== 'transitioning') {
      return state;
    }
    const stateUpdates = {
      mode: 'readyToGuess'
    };

    return Object.assign(
      {},
      state,
      stateUpdates
    );
  };
}

function updateGuessInput (text) {
  return function updateGuessInputValue (state) {
    const stateUpdates = {
      guessInputValue: text
    };

    return Object.assign(
      {},
      state,
      stateUpdates
    );
  };
}

function actions ({guessButton$, guessText$, nextFlashcard$, enterKey$, transitionEnd$}) {
  return Rx.Observable.merge(
    guessButton$.withLatestFrom(guessText$, (_, text) => makeGuess(text)),
    nextFlashcard$.map(nextFlashcard),
    enterKey$.withLatestFrom(guessText$, (_, text) => handleEnterKey(text)),
    transitionEnd$.map(transitionEnd),
    guessText$.map(updateGuessInput)
  );
}

function model (action$, flashcards) {
  const initialState = {
    flashcards,
    flashcardsToReview: flashcards.slice(0, 3),
    flashcardReviewIndex: 0,
    guesses: [],
    mode: 'readyToGuess'
  };

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

module.exports = function Flashcards ({DOM}, props) {
  dirtySideEffects();

  return model(actions(intent(DOM)), props.flashcards);
};
