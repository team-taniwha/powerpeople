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
    staff_member = StaffMember.find_or_initialize_by(name: person.name)

    if staff_member.new_record?
      CreateFlashcardsForNewStaffMember.new(
        staff_member: staff_member
      ).call
    end

    staff_member.update_attributes!(
      :bio => person.bio,
      :image_url => person.image_url,
      :position => person.position,
      :city => person.city
    )
  end
end
