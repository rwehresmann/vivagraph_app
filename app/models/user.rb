class User < ApplicationRecord
  validates_presence_of :name

  has_many :answers
  has_many :exercises, through: :answers
end
