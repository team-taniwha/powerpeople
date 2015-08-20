class CreateFlashcardsForNewStaffMember
  def initialize(staff_member:)
    @staff_member = staff_member
  end

  def call
    User.all.each do |user|
      user.flashcards.find_or_create_by(staff_member_id: @staff_member.id)
    end
  end
end
