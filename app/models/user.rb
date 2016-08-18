class User < ActiveRecord::Base
  has_many :flashcards, dependent: :destroy
end
