class Exercise < ApplicationRecord
  validates_presence_of :name

  has_many :answers
  has_and_belongs_to_many :users_tried, class_name: "User"
end
