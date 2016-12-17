class Answer < ApplicationRecord
  validates_inclusion_of :correct, :in => [true, false]

  belongs_to :user
  belongs_to :exercise
end
