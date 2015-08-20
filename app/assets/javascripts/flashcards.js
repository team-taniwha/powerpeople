/* globals $ */

const Cycle = require('@cycle/core');
const {h, makeDOMDriver} = require('@cycle/dom');
const _ = require('lodash');

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
    .concat(Cycle.Rx.Observable.never());

  const flashcards$ = Cycle.Rx.Observable.zip(
    flashcard$,
    flashcard$.skip(1),
    flashcard$.skip(2)
   ).zip(stateReadyToGuess$, (flashcards, _) => flashcards)
    .startWith([{}, {}, {}])
    .map(log('zipped flashcards'));

  const guess$ = stateMadeGuess$
    .withLatestFrom(guessValue$, (_, guess) => ({name: guess}))
    .map(log('guess'));

  const guessScore$ = guess$.withLatestFrom(flashcards$, (guess, flashcards) => {
    return {
      flashcardId: flashcards[1].id,
      score: calculateGuessScore(guess.name, flashcards[1].staff_member.name)
    };
  });

  sendGuessesToServer(guessScore$.map(log('submittedScore')));

  return {
    state$: state$.withLatestFrom(
      guess$,
      guessScore$,
      flashcards$,
      stateReadyToGuess$.map(_ => ''),
      (state, guessResult, guessScore, flashcards, guessInputValue) => ({state, guessResult, guessScore, flashcards, guessInputValue})
    ).map(log('modelState')).startWith({state: 'readyToGuess', flashcards: [window.flashcards[0], window.flashcards[1], window.flashcards[2]], guessScore: {name: 'fgsfdg'}, guessResult: {score: 3}})
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

