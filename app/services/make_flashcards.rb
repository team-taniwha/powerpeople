class MakeFlashcards
  def self.for(user)
    new(user: user)
  end

  def initialize(user:)
    @user = user
  end

  def call
    staff_members_to_make_flashcards_for.each do |staff_member|
      make_flashcard_of(staff_member)
    end
  end

  private

  def staff_members_to_make_flashcards_for
    StaffMember.all
  end

  def make_flashcard_of(staff_member)
    @user.flashcards.create!(
      staff_member_id: staff_member.id
    )
  end
end
