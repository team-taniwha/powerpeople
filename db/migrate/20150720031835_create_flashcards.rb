class CreateFlashcards < ActiveRecord::Migration
  def change
    create_table :flashcards do |t|
      t.integer :user_id
      t.integer :staff_member_id

      t.timestamps null: false
    end
  end
end
