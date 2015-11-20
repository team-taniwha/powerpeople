/* globals describe, it */

const Rx = require('rx');
const assert = require('assert');
const collectionAssert = require('./spec_helper');
const {mockDOMResponse} = require('@cycle/dom');

const onNext = Rx.ReactiveTest.onNext;
const onCompleted = Rx.ReactiveTest.onCompleted;
const subscribe = Rx.ReactiveTest.subscribe;

const Flashcards = require('../../app/assets/javascripts/flashcards');

global.authenticity_token = "swordfish";
global.document = {};
global.scroll = () => {};

Rx.Observable.fromEvent = (_element, selector) => {
  return Rx.Observable.empty();
}

const flashcardData = [
  {
    "id": 170,
    "user_id": 1,
    "staff_member_id": 161,
    "created_at": "2015-08-25T12:06:33.583Z",
    "updated_at": "2015-08-25T12:06:33.583Z",
    "easiness_factor": 2.5,
    "repetitions": 0,
    "interval": 0,
    "due": null,
    "studied_at": null,
    "staff_member": {
      "id": 161,
      "name": "Fred",
      "bio": "",
      "image_url": "",
      "position": "Caveman",
      "city": "Bedrock",
      "created_at": "2015-08-25T12:01:44.268Z",
      "updated_at": "2015-08-25T12:01:44.285Z"
    }
  },
  {
    "id": 251,
    "user_id": 1,
    "staff_member_id": 108,
    "created_at": "2015-08-25T12:06:33.968Z",
    "updated_at": "2015-08-25T12:06:33.968Z",
    "easiness_factor": 2.5,
    "repetitions": 0,
    "interval": 0,
    "due": null,
    "studied_at": null,
    "staff_member": {
      "id": 108,
      "name": "Wilma",
      "bio": "",
      "image_url": "",
      "position": "",
      "city": "Bedrock",
      "created_at": "2015-08-25T12:01:43.019Z",
      "updated_at": "2015-08-25T12:01:43.034Z"
    }
  },
  {
    "id": 252,
    "user_id": 1,
    "staff_member_id": 17,
    "created_at": "2015-08-25T12:06:33.973Z",
    "updated_at": "2015-08-25T12:06:33.973Z",
    "easiness_factor": 2.5,
    "repetitions": 0,
    "interval": 0,
    "due": null,
    "studied_at": null,
    "staff_member": {
      "id": 17,
      "name": "Dino",
      "bio": "",
      "image_url": "",
      "position": "",
      "city": "Bedrock",
      "created_at": "2015-08-21T02:10:34.058Z",
      "updated_at": "2015-08-21T02:10:34.063Z"
    }
  },
  {
    "id": 253,
    "user_id": 1,
    "staff_member_id": 159,
    "created_at": "2015-08-25T12:06:33.978Z",
    "updated_at": "2015-08-25T12:06:33.978Z",
    "easiness_factor": 2.5,
    "repetitions": 0,
    "interval": 0,
    "due": null,
    "studied_at": null,
    "staff_member": {
      "id": 159,
      "name": "Baby Puss",
      "bio": "",
      "image_url": "",
      "position": "",
      "city": "Bedrock",
      "created_at": "2015-08-25T12:01:44.232Z",
      "updated_at": "2015-08-25T12:01:44.250Z"
    }
  },
  {
    "id": 254,
    "user_id": 1,
    "staff_member_id": 47,
    "created_at": "2015-08-25T12:06:33.981Z",
    "updated_at": "2015-08-25T12:06:33.981Z",
    "easiness_factor": 2.5,
    "repetitions": 0,
    "interval": 0,
    "due": null,
    "studied_at": null,
    "staff_member": {
      "id": 47,
      "name": "Pebbles",
      "bio": "",
      "image_url": "",
      "position": "",
      "city": "Bedrock",
      "created_at": "2015-08-21T02:10:34.472Z",
      "updated_at": "2015-08-21T02:10:34.486Z"
    }
  }
];

const props = {
  flashcards: flashcardData
};

describe('the flashcard app', () => {
  it('starts out with three flashcards', () => {
    const scheduler = new Rx.TestScheduler();

    const mockedResponse = mockDOMResponse({
    });

    const results = scheduler.startScheduler(() => {
      return Flashcards({DOM: mockedResponse}, props)
        .state$.pluck('flashcardsToReview').pluck('length')
        .distinctUntilChanged();
    });

    collectionAssert.assertEqual([
      onNext(200, 3),
      onCompleted(200)
    ], results.messages);
  });

  it('goes to the next card after a guess', () => {
    const scheduler = new Rx.TestScheduler();

    const input$ = scheduler.createHotObservable(
      onNext(250, {target: {value: 'Wilmer'}})
    );

    const makeGuess$ = scheduler.createHotObservable(
      onNext(300, {})
    );

    const nextCard$ = scheduler.createHotObservable(
      onNext(350, {})
    );

    const mockedResponse = mockDOMResponse({
      '.guess': {
        'input': input$
      },

      '.makeGuess': {
        'click': makeGuess$
      },

      '.proceed': {
        'click': nextCard$
      }
    });

    const results = scheduler.startScheduler(() => {
      return Flashcards({DOM: mockedResponse}, props)
        .state$.pluck('flashcardsToReview').map(f => f.map(card => card.staff_member.name))
        .distinctUntilChanged()
    });

    collectionAssert.assertEqual([
      onNext(200, ['Fred', 'Wilma', 'Dino']),
      onNext(350, ['Wilma', 'Dino', 'Baby Puss'])
    ], results.messages);
  });

  it('lets you use enter to make guesses and progress', () => {
    const scheduler = new Rx.TestScheduler();

    const input$ = scheduler.createHotObservable(
      onNext(250, {target: {value: 'Wilmer'}})
    );

    const keypress$ = scheduler.createHotObservable(
      onNext(300, {key: 'Enter'}),
      onNext(350, {key: 'Enter'})
    );

    Rx.Observable.fromEvent = (_element, selector) => {
      if (selector === 'keypress') {
        return keypress$;
      }

      return Rx.Observable.empty();
    };

    const mockedResponse = mockDOMResponse({
      '.guess': {
        'input': input$
      }
    });

    const results = scheduler.startScheduler(() => {
      return Flashcards({DOM: mockedResponse}, props)
        .state$.pluck('flashcardsToReview').map(f => f.map(card => card.staff_member.name))
        .distinctUntilChanged()
    });

    collectionAssert.assertEqual([
      onNext(200, ['Fred', 'Wilma', 'Dino']),
      onNext(350, ['Wilma', 'Dino', 'Baby Puss'])
    ], results.messages);
  });

  it('changes mode as expected', () => {
    const scheduler = new Rx.TestScheduler();

    const input$ = scheduler.createHotObservable(
      onNext(250, {target: {value: 'Dane Buck'}})
    );

    const makeGuess$ = scheduler.createHotObservable(
      onNext(300, {})
    );

    const nextCard$ = scheduler.createHotObservable(
      onNext(350, {})
    );

    const transitionEnd$ = scheduler.createHotObservable(
      onNext(400, {})
    );

    const mockedResponse = mockDOMResponse({
      '.guess': {
        'input': input$
      },

      '.makeGuess': {
        'click': makeGuess$
      },

      '.proceed': {
        'click': nextCard$
      },

      ':root': {
        'transitionend': transitionEnd$
      }
    });

    const results = scheduler.startScheduler(() => {
      return Flashcards({DOM: mockedResponse}, props).state$.pluck('mode').distinctUntilChanged();
    });

    collectionAssert.assertEqual([
      onNext(200, 'readyToGuess'),
      onNext(300, 'madeGuess'),
      onNext(350, 'transitioning'),
      onNext(400, 'readyToGuess')
    ], results.messages);
  });

  it('submits guesses to the server', () => {
    const scheduler = new Rx.TestScheduler();

    const input$ = scheduler.createHotObservable(
      onNext(250, {target: {value: 'Wilmer'}})
    );

    const makeGuess$ = scheduler.createHotObservable(
      onNext(300, {})
    );

    const mockedResponse = mockDOMResponse({
      '.guess': {
        'input': input$
      },

      '.makeGuess': {
        'click': makeGuess$
      }
    });

    const results = scheduler.startScheduler(() => {
      return Flashcards({DOM: mockedResponse}, props).HTTP;
    });

    collectionAssert.assertEqual([
      onNext(300, {
        url: '/flashcards/251',
        method: 'PUT',
        type: 'application/json',
        send: {recollection_quality: 3, _method: 'PUT', authenticity_token: 'swordfish'}
      })
    ], results.messages);
  });
});
