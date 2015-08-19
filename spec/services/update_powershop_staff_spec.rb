require 'rails_helper'

describe UpdatePowershopStaff do
  it 'adds missing staff members' do
    person = OpenStruct.new(
      name: 'Test',
      bio: 'Magnificent',
      image_url: 'http://example.org/fake.png',
      position: 'Test Person',
      city: 'Wellington'
    )

    UpdatePowershopStaff.new(people: [person]).call

    staff_member = StaffMember.last
    expect(staff_member.name).to eq person.name
    expect(staff_member.bio).to eq person.bio
    expect(staff_member.image_url).to eq person.image_url
    expect(staff_member.position).to eq person.position
    expect(staff_member.city).to eq person.city
  end

  it 'requests that flashcards are made for new staff' do
  end
end
