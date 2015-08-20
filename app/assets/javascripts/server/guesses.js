/* globals $ */

function updateServer (payload) {
  $.ajax({
    url: `/flashcards/${payload.flashCardId}`,
    method: 'POST',
    dataType: 'JSON',
    data: {recollection_quality: payload.score, _method: 'PUT'}
  });
}

function sendGuessesToServer (guessScore$) {
  guessScore$.forEach(updateServer);
}

module.exports = sendGuessesToServer;
