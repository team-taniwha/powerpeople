class User < ActiveRecord::Base
  has_many :flashcards
end
