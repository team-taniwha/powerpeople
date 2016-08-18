class FlashcardsController < ApplicationController
  def index
    response.headers.delete "X-Frame-Options"

    if current_user.flashcards.employed_flashcards.count < StaffMember.employed.count
      MakeFlashcards.for(current_user).call
    end

    @flashcards = current_user.flashcards.employed_flashcards
      .sort_by { |flashcard| flashcard.due || Time.new(0) }
  end

  def update
    flashcard = Flashcard.find(params[:id])

    flashcard.review(params[:recollection_quality].to_i)

    if (1..3).include? params[:recollection_quality].to_i
      flashcard.update_attributes!(:due => Date.tomorrow)
    end

    redirect_to :action => :index
  end

  def sign_in
    redirect_to 'https://winkyworld.powershop.com/PowerPeople'
  end

  def current_user
    @current_user ||= User.where(
      email: google_auth_data.email
    ).first_or_create!
  end
end
