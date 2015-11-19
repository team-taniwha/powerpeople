class StaffMember < ActiveRecord::Base
  acts_as_learnable

  has_many :flashcards

  def joined_powershop_recently?
    created_at  > Date.today.prev_month
  end
end
