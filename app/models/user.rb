class User < ApplicationRecord
  validates_presence_of :name

  has_many :answers
  has_and_belongs_to_many :exercises_tried, class_name: "Exercise"
end
