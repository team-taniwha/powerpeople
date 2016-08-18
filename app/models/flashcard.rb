class Flashcard < ActiveRecord::Base
  belongs_to :user
  belongs_to :staff_member

  scope :employed_flashcards, -> { joins(:staff_member).merge(StaffMember.employed) }

  acts_as_learnable
end
