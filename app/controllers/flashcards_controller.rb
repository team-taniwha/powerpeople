class FlashcardsController < ApplicationController
  def index
    if current_user.flashcards.count < StaffMember.count
      MakeFlashcards.for(current_user).call
    end

    @flashcards = current_user.flashcards
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

  def current_user
    @current_user ||= User.where(
      email: google_auth_data.email
    ).first_or_create!
  end
end
