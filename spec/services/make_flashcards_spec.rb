require 'rails_helper'

describe MakeFlashcards do
  before do
    StaffMember.create!(name: 'Test')
    StaffMember.create!(name: 'Test2')
    StaffMember.create!(name: 'Test3')
  end

  let(:user) { User.create! }

  it 'makes flashcards' do
    expect(user.flashcards.count).to eq 0

    MakeFlashcards.for(user).call

    expect(user.flashcards.count).to eq StaffMember.count
  end

  it 'only creates missing flashcards' do
    user.flashcards.create!(staff_member_id: StaffMember.first.id)

    MakeFlashcards.for(user).call

    expect(user.flashcards.count).to eq StaffMember.count
    expect(user.flashcards.pluck(:staff_member_id))
      .to contain_exactly(*StaffMember.pluck(:id))
  end
end
