class Answer < ApplicationRecord
  validates_presence_of :correct

  belongs_to :user
  belongs_to :exercise
end
