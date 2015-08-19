class FlashcardsController < ApplicationController
  def index
    @flashcards = User.first.flashcards.select(&:due_today?)
      .sort_by { |flashcard| flashcard.due || Time.now }
  end

  def update
    flashcard = Flashcard.find(params[:id])

    flashcard.review(params[:recollection_quality].to_i)

    if (1..3).include? params[:recollection_quality].to_i
      flashcard.update_attributes!(:due => Date.tomorrow)
    end

    redirect_to :action => :index
  end
end
