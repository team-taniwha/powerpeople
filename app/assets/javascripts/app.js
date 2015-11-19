const Cycle = require('@cycle/core');
const {makeDOMDriver} = require('@cycle/dom');
const {makeHTTPDriver} = require('@cycle/http');

const Flashcards = require('./flashcards');

function main (responses) {
  return Flashcards(responses, {flashcards: window.flashcards});
}

$(() => {
  const drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver({eager: true})
  };

  Cycle.run(main, drivers);
});

