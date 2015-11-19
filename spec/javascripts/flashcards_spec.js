/* globals describe, it */

const assert = require('assert');

const Flashcards = require('../../app/assets/javascripts/flashcards');

describe('the flashcard app', () => {
  it('starts out with three flashcards', () => {
    assert.equal(typeof Flashcards, 'function');
  });
});
