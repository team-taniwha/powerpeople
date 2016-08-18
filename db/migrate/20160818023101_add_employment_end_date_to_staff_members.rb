class AddEmploymentEndDateToStaffMembers < ActiveRecord::Migration
  def change
    add_column :staff_members, :employment_end_date, :date
  end
end
