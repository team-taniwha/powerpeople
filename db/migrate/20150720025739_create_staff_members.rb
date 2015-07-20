class CreateStaffMembers < ActiveRecord::Migration
  def change
    create_table :staff_members do |t|
      t.string :name
      t.text :bio
      t.string :image_url
      t.string :position
      t.string :city

      t.timestamps null: false
    end
  end
end
