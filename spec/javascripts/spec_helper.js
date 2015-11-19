import Rx from 'rx';
import assert from 'assert';

function ok (isOk, message) {
  if (!isOk) {
    throw new Error(message);
  }
}

function createMessage(expected, actual) {
  return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

function prettyMessage (message) {
  if (message.value === undefined) {
    return `@${message.time}: NO VALUE `;
  }

  if (message.value.kind === 'N') {
    return `  @${message.time}: ${JSON.stringify(message.value.value)}`;
  }

  if (message.value.kind === 'C') {
    return `  @${message.time}: -- Complete --`;
  }

  if (message.value.kind === 'E') {
    return `  @${message.time}: -- Error! --: ${message.value.error}`;
  }

  if (message.value.predicate) {
    return `  @${message.time}: PREDICATE ${message.value.predicate.toString()}`;
  }

  return '  IMPLEMENT KIND ' + message.value.kind;
}

function prettyMessages (messages) {
  return messages.map(prettyMessage).join('\n');
}

function createMessage (expected, actual) {
  return 'Expected: \n[\n' + prettyMessages(expected) + '\n]\r\n\nActual: \n[\n' + prettyMessages(actual) + '\n]';
}

var collectionAssert = {
  assertEqual: function (expected, actual) {
    let comparer = Rx.internals.isEqual;
    let isOk = true;

    let isEqualSize = true;

    if (expected.length !== actual.length) {
      console.log('Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
      isEqualSize = false;
    }

    for(var i = 0, len = expected.length; i < len; i++) {
      if (expected[i].value && expected[i].value.predicate) {
        isOk = expected[i].value.predicate(actual[i].value.value);
      } else {
        isOk = comparer(expected[i], actual[i]);
      }

      if (!isOk) {
        break;
      }
    }

    assert(isOk && isEqualSize, createMessage(expected, actual));
  }
};

module.exports = collectionAssert;
