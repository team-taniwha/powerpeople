class AddWinkyworldIdToStaffMembers < ActiveRecord::Migration
  def change
    add_column :staff_members, :winkyworld_id, :string, null: false, unique: true
  end
end
