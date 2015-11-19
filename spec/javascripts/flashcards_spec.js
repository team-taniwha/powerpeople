/* globals describe, it */

const Rx = require('rx');
const assert = require('assert');
const collectionAssert = require('./spec_helper');
const {mockDOMResponse} = require('@cycle/dom');

const onNext = Rx.ReactiveTest.onNext;
const onCompleted = Rx.ReactiveTest.onCompleted;
const subscribe = Rx.ReactiveTest.subscribe;

const Flashcards = require('../../app/assets/javascripts/flashcards');

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

describe('the flashcard app', () => {
  it('starts out with three flashcards', () => {
    const scheduler = new Rx.TestScheduler();

    const mockedResponse = mockDOMResponse({
    });

    const props = {
      flashcards: flashcardData
    };

    const results = scheduler.startScheduler(() => {
      return Flashcards({DOM: mockedResponse, props}).state$;
    });

    collectionAssert.assertEqual([
      onNext(200, state => {
        assert.equal(state.flashcards.length, 3);
        return true;
      }),
      onCompleted(200)
    ], results.messages);
  });
});
