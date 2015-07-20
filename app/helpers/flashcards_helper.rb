module FlashcardsHelper
  def flashcard_response_button(flashcard, text, recollection_quality)
    button_to(
      text,
      flashcard_path(flashcard),
      :method => :put,
      :params => {
        :recollection_quality => recollection_quality
      }
    )
  end
end
