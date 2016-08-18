class UpdatePowershopStaff
  def self.from_winkyworld
    new(people: GetPeopleFromWinkyworld.new.call).call
  end

  def initialize(people:)
    @people = people
  end

  def call
    update_departed_staff_members

    @people.each do |person|
      update_or_create_staff_member(person)
    end
  end

  private

  def update_departed_staff_members
    currently_employed_winkyworld_ids = @people.map(&:winkyworld_id)
    persisted_winkyworld_ids = StaffMember.pluck(:winkyworld_id)
    departed_employee_ids = persisted_winkyworld_ids - currently_employed_winkyworld_ids

    StaffMember.where(:winkyworld_id => departed_employee_ids, :employment_end_date => nil).update_all(:employment_end_date => Date.today)
  end

  def update_or_create_staff_member(person)
    staff_member = StaffMember.find_or_initialize_by(winkyworld_id: person.winkyworld_id)

    if staff_member.new_record?
      staff_member.save!

      CreateFlashcardsForNewStaffMember.new(
        staff_member: staff_member
      ).call
    end

    staff_member.update_attributes!(
      :name => person.name,
      :bio => person.bio,
      :image_url => person.image_url,
      :position => person.position,
      :city => person.city,
      :employment_end_date => nil
    )
  end
end
