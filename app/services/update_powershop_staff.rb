class UpdatePowershopStaff
  def self.from_winkyworld
    new(people: GetPeopleFromWinkyworld.new.call)
  end

  def initialize(people:)
    @people = people
  end

  def call
    @people.each do |person|
      update_or_create_staff_member(person)
    end
  end

  private

  def update_or_create_staff_member(person)
    existing_staff_member = StaffMember.find_by(name: person.name)
    staff_member = StaffMember.find_or_initialize_by(name: person.name)

    staff_member.update_attributes!(
      :bio => person.bio,
      :image_url => person.image_url,
      :position => person.position,
      :city => person.city
    )
  end
end
