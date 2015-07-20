class StaffMember < ActiveRecord::Base
  acts_as_learnable

  has_many :flashcards
end
