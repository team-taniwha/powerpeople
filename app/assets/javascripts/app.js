const Cycle = require('@cycle/core');
const {makeDOMDriver} = require('@cycle/dom');

const Flashcards = require('./flashcards');

function main (responses) {
  return Flashcards(responses, {flashcards: window.flashcards});
}

$(() => {
  const drivers = {
    DOM: makeDOMDriver('#app')
  };

  Cycle.run(main, drivers);
});

