/* globals $ */

const Cycle = require('@cycle/core');
const {makeDOMDriver} = require('@cycle/dom');
const _ = require('lodash');

const renderFlashcard = require('./views/flashcard');
const calculateGuessScore = require('./calculations/guess-score');
const sendGuessesToServer = require('./server/guesses');

function log (label) { return (thing) => { console.log(label, thing); return thing; }; }

function view ({state$}) {
  return state$.map(log('state')).map(({state, flashcard, guessResult, guessScore, guessInputValue}) => (
    renderFlashcard(flashcard, state === 'madeGuess', guessResult, guessScore.score, guessInputValue)
  ));
}

function model ({guessValue$, guessButton$, nextFlashcard$, enterKey$}) {
  const states = [
    'readyToGuess',
    'madeGuess'
  ];

  const progressState$ = Cycle.Rx.Observable.merge(
    guessButton$.map(_ => 'guessClick'),
    nextFlashcard$.map(_ => 'nextClick'),
    enterKey$.map(_ => 'enter')
  ).map(log('progress'));

  const state$ = progressState$.scan((currentState, __) => {
    const currentStateIndex = _.findIndex(states, state => state === currentState);

    return states[(currentStateIndex + 1) % states.length];
  }, 'readyToGuess').startWith('readyToGuess').map(log('currentState'));

  const stateReadyToGuess$ = state$.filter(state => state === 'readyToGuess');
  const stateMadeGuess$ = state$.filter(state => state === 'madeGuess');

  const flashcard$ = Cycle.Rx.Observable.from(window.flashcards)
    .concat(Cycle.Rx.Observable.never())
    .zip(stateReadyToGuess$, (flashcard, _) => flashcard)
    .map(log('flashcard'));

  const guess$ = stateMadeGuess$
    .withLatestFrom(guessValue$, (_, guess) => ({name: guess}))
    .map(log('guess'));

  const guessScore$ = guess$.withLatestFrom(flashcard$, (guess, flashcard) => {
    return {
      flashcardId: flashcard.id,
      score: calculateGuessScore(guess.name, flashcard.staff_member.name)
    };
  });

  sendGuessesToServer(guessScore$.map(log('submittedScore')));

  return {
    state$: state$.withLatestFrom(
      guess$,
      guessScore$,
      flashcard$,
      stateReadyToGuess$.map(_ => ''),
      (state, guessResult, guessScore, flashcard, guessInputValue) => ({state, guessResult, guessScore, flashcard, guessInputValue})
    ).map(log('modelState')).startWith({state: 'readyToGuess', flashcard: window.flashcards[0], guessScore: {name: 'fgsfdg'}, guessResult: {score: 3}})
  };
}

function keyPressed (key) {
  return (ev) => ev.key === key;
}

function intent (DOM) {
  const keyPress$ = Cycle.Rx.Observable.fromEvent(document, 'keypress');

  return {
    guessValue$: DOM.get('.guess', 'input').map(e => e.target.value).startWith(''),
    guessButton$: DOM.get('.makeGuess', 'click'),
    nextFlashcard$: DOM.get('.proceed', 'click'),

    enterKey$: keyPress$.filter(keyPressed('Enter'))
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

