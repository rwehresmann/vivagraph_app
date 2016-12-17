class Exercise < ApplicationRecord
  validates_presence_of :name

  has_many :answers
  has_many :users, through: :answers
end
