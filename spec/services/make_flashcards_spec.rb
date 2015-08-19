require 'rails_helper'

describe MakeFlashcards do
  before do
    StaffMember.create!(:name => 'Test')
    StaffMember.create!(:name => 'Test2')
    StaffMember.create!(:name => 'Test3')
  end

  it 'makes flashcards' do
    user = User.create!

    expect(user.flashcards.count).to eq 0

    MakeFlashcards.for(user).call

    expect(user.flashcards.count).to eq StaffMember.count
  end
end
