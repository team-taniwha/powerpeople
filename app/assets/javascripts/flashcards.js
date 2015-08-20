var Flashcards = (function () {

  function setupMoreInfoButton () {
    $('.show-more-info').on('click', function () {
      $(this).hide();
      $('.guess-name').hide();
      $('.more-info').show();
    });
  };

  return {
    start: function () {
      setupMoreInfoButton();
    }
  };
}());

$(Flashcards.start);

