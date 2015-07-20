class FlashcardsController < ApplicationController
  def index
    @flashcards = User.first.flashcards.select(&:due_today?)
      .sort_by { |flashcard| flashcard.due || Time.now }
  end

  def update
    flashcard = Flashcard.find(params[:id])

    flashcard.review(params[:recollection_quality].to_i)

    flashcard.save!

    redirect_to :action => :index
  end
end
