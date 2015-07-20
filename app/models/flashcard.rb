class Flashcard < ActiveRecord::Base
  belongs_to :user
  belongs_to :staff_member

  acts_as_learnable
end
