class AddFlashcardFieldsToFlashcards < ActiveRecord::Migration
  def self.up
    add_column :flashcards, :easiness_factor, :float,   default: 2.5
    add_column :flashcards, :repetitions,     :integer, default: 0
    add_column :flashcards, :interval,        :integer, default: 0
    add_column :flashcards, :due,             :date,    default: nil
    add_column :flashcards, :studied_at,      :date,    default: nil
  end

  def self.down
    remove_column :flashcards, :easiness_factor
    remove_column :flashcards, :repetitions
    remove_column :flashcards, :interval
    remove_column :flashcards, :due
    remove_column :flashcards, :studied_at
  end
end
