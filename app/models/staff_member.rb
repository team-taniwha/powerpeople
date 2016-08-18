class StaffMember < ActiveRecord::Base
  acts_as_learnable

  has_many :flashcards, dependent: :destroy

  scope :employed, -> { StaffMember.where(:employment_end_date => nil) }

  def joined_powershop_recently?
    created_at  > Date.today.prev_month
  end

  def first_name
    name.split.first
  end
end
