require 'rails_helper'

describe CreateFlashcardsForNewStaffMember do
  it 'creates a flashcard for every user' do
    user1 = User.create!
    user2 = User.create!

    staff_member = StaffMember.create!

    CreateFlashcardsForNewStaffMember.new(staff_member: staff_member).call

    expect(Flashcard.count).to eq User.count
  end
end
