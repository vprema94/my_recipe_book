class Recipe < ApplicationRecord
  belongs_to :user
  has_many :rec_ings
  has_many :ingredients, through: :rec_ings
  has_many :comments
end
